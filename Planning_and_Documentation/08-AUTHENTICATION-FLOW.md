# eDuBaskets - Authentication & Authorization Flow

## 🔐 Authentication Overview

**Auth Provider:** NextAuth.js v5 (Auth.js)  
**Session Strategy:** JWT (Serverless-friendly)  
**Providers:** Email/Password, Google OAuth  
**Session Duration:** 30 days

---

## 🏗️ Authentication Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Client (Browser)                       │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  Login Form  →  Submit  →  NextAuth API  →  Session      │
│                                     ↓                      │
│                               JWT Token                   │
│                                     ↓                      │
│                           Stored in Cookie                │
│                                                            │
└──────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│                    Server (Next.js API)                   │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  Middleware  →  Verify JWT  →  Check Role  →  Allow/Deny │
│                        ↓                                   │
│                   Database Query                          │
│                   (User lookup)                           │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

---

## 📋 Authentication Flows

### 1. Email/Password Registration Flow

```
User fills registration form
  ↓
Client-side validation (Zod schema)
  ↓
POST /api/auth/register
  ↓
Server validates input
  ↓
Check if email already exists
  ↓
Hash password (bcrypt, 10 rounds)
  ↓
Create user in database (role: STUDENT by default)
  ↓
Send welcome email
  ↓
Auto-login user (create session)
  ↓
Redirect to home page
```

**API Endpoint:**
```typescript
// /app/api/auth/register/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  
  // Validate
  const validation = registerSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    )
  }
  
  // Check existing user
  const existing = await prisma.user.findUnique({
    where: { email: validation.data.email }
  })
  
  if (existing) {
    return NextResponse.json(
      { error: 'Email already registered' },
      { status: 400 }
    )
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(
    validation.data.password,
    10
  )
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email: validation.data.email,
      name: validation.data.name,
      password: hashedPassword,
      role: 'STUDENT',
      phoneNumber: validation.data.phoneNumber
    }
  })
  
  // Send welcome email
  await sendWelcomeEmail(user.email, user.name)
  
  // Return success
  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  }, { status: 201 })
}
```

---

### 2. Email/Password Login Flow

```
User enters credentials
  ↓
Client-side validation
  ↓
POST to NextAuth API (/api/auth/callback/credentials)
  ↓
NextAuth calls authorize() function
  ↓
Look up user by email
  ↓
Compare password hash
  ↓
If valid: Create JWT session
  ↓
Set HTTP-only cookie
  ↓
Return user data
  ↓
Redirect based on role:
  - STUDENT → /
  - VENDOR → /dashboard
  - ADMIN → /admin/dashboard
```

**NextAuth Config:**
```typescript
// /lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { vendor: true }
        })

        if (!user || !user.password) {
          return null
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          return null
        }

        // Check if account is active
        if (!user.isActive) {
          return null
        }

        // Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image
        }
      }
    }),
    
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  
  callbacks: {
    async signIn({ user, account }) {
      // Google OAuth
      if (account?.provider === 'google') {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (!existingUser) {
          // Create new user
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              image: user.image,
              role: 'STUDENT',
              emailVerified: new Date()
            }
          })
        }
      }
      
      return true
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  
  pages: {
    signIn: '/login',
    error: '/login'
  }
})
```

---

### 3. Google OAuth Flow

```
User clicks "Continue with Google"
  ↓
Redirect to Google OAuth consent screen
  ↓
User approves permissions
  ↓
Google redirects back with authorization code
  ↓
NextAuth exchanges code for access token
  ↓
Fetch user profile from Google
  ↓
Check if user exists in database
  ↓
If not: Create new user
  ↓
Create session
  ↓
Redirect to home page
```

**Google Sign-In Button:**
```typescript
// /components/auth/GoogleSignInButton.tsx
'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function GoogleSignInButton() {
  const handleSignIn = async () => {
    await signIn('google', { 
      callbackUrl: '/' 
    })
  }

  return (
    <Button 
      onClick={handleSignIn}
      variant="outline"
      className="w-full"
    >
      <svg /* Google icon */ />
      Continue with Google
    </Button>
  )
}
```

---

### 4. Logout Flow

```
User clicks logout
  ↓
Call signOut() from NextAuth
  ↓
Clear session cookie
  ↓
Redirect to login page
```

**Logout Implementation:**
```typescript
import { signOut } from 'next-auth/react'

async function handleLogout() {
  await signOut({ callbackUrl: '/login' })
}
```

---

## 🛡️ Authorization (Role-Based Access Control)

### User Roles

```typescript
enum UserRole {
  STUDENT   // Can browse and order
  VENDOR    // Can create hampers and manage orders
  DRIVER    // Can accept and deliver (Phase 2)
  ADMIN     // Full platform access
}
```

---

### Middleware Protection

**Route Protection:**
```typescript
// /middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth
  
  // Public routes
  const publicRoutes = ['/login', '/register', '/']
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }
  
  // Protected routes - require authentication
  if (!session) {
    return NextResponse.redirect(
      new URL('/login', req.url)
    )
  }
  
  // Role-based access
  const role = session.user.role
  
  // Vendor routes
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/hampers/create')) {
    if (role !== 'VENDOR') {
      return NextResponse.redirect(
        new URL('/', req.url)
      )
    }
  }
  
  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (role !== 'ADMIN') {
      return NextResponse.redirect(
        new URL('/', req.url)
      )
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
```

---

### API Route Protection

**Protecting API Endpoints:**
```typescript
// /app/api/hampers/route.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Check authentication
  const session = await auth()
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Check role
  if (session.user.role !== 'VENDOR') {
    return NextResponse.json(
      { error: 'Forbidden - Vendors only' },
      { status: 403 }
    )
  }
  
  // Proceed with hamper creation
  // ...
}
```

---

### Server Component Protection

**Protecting Server Components:**
```typescript
// /app/(vendor)/dashboard/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function VendorDashboard() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }
  
  if (session.user.role !== 'VENDOR') {
    redirect('/')
  }
  
  // Render vendor dashboard
  return (
    <div>...</div>
  )
}
```

---

### Client Component Protection

**Using useSession Hook:**
```typescript
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])
  
  if (status === 'loading') {
    return <LoadingSpinner />
  }
  
  return (
    <div>Protected Content</div>
  )
}
```

---

## 🔑 Session Management

### Getting Current User

**Server Component:**
```typescript
import { auth } from '@/lib/auth'

export default async function Page() {
  const session = await auth()
  
  const user = session?.user
  // user.id, user.email, user.role
}
```

**Client Component:**
```typescript
'use client'

import { useSession } from 'next-auth/react'

export default function Component() {
  const { data: session } = useSession()
  
  const user = session?.user
}
```

**API Route:**
```typescript
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const userId = session.user.id
}
```

---

### Session Refresh

Sessions automatically refresh when accessed. Manual refresh:

```typescript
'use client'

import { useSession } from 'next-auth/react'

export function Component() {
  const { data: session, update } = useSession()
  
  async function refreshSession() {
    await update()
  }
}
```

---

## 🔒 Security Best Practices

### 1. Password Security

**Hashing:**
```typescript
import bcrypt from 'bcryptjs'

// Hash password (registration)
const hashedPassword = await bcrypt.hash(password, 10)

// Verify password (login)
const isValid = await bcrypt.compare(
  plainPassword,
  hashedPassword
)
```

**Requirements:**
- Minimum 8 characters
- Mix of letters and numbers (enforced in UI validation)
- Hashed with bcrypt (10 rounds)

---

### 2. HTTP-Only Cookies

NextAuth automatically stores sessions in HTTP-only cookies, preventing JavaScript access and XSS attacks.

---

### 3. CSRF Protection

NextAuth includes built-in CSRF protection via tokens.

---

### 4. Session Expiry

```typescript
session: {
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60     // Update session every 24 hours
}
```

---

### 5. Environment Variables

Never commit these to Git:

```bash
# .env.local
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

Generate secret:
```bash
openssl rand -base64 32
```

---

## 📧 Email Verification (Phase 2)

MVP skips email verification, but here's the implementation for Phase 2:

```typescript
// Generate verification token
const token = crypto.randomBytes(32).toString('hex')

await prisma.verificationToken.create({
  data: {
    identifier: user.email,
    token: token,
    expires: new Date(Date.now() + 3600000) // 1 hour
  }
})

// Send verification email
await sendVerificationEmail(
  user.email,
  `${process.env.NEXTAUTH_URL}/verify?token=${token}`
)
```

---

## 🔄 Password Reset Flow

### 1. Request Reset

```
User clicks "Forgot Password"
  ↓
Enter email
  ↓
POST /api/auth/forgot-password
  ↓
Generate reset token
  ↓
Store token in database (expires in 1 hour)
  ↓
Send reset email with link
  ↓
User clicks link in email
  ↓
Redirect to reset password page
```

**API Endpoint:**
```typescript
// /app/api/auth/forgot-password/route.ts
export async function POST(request: Request) {
  const { email } = await request.json()
  
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (!user) {
    // Don't reveal if email exists
    return NextResponse.json({
      message: 'If that email is registered, you will receive a reset link'
    })
  }
  
  // Generate token
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 3600000) // 1 hour
  
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires
    }
  })
  
  // Send email
  await sendPasswordResetEmail(
    email,
    `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  )
  
  return NextResponse.json({
    message: 'If that email is registered, you will receive a reset link'
  })
}
```

---

### 2. Reset Password

```
User opens reset link
  ↓
Verify token validity
  ↓
Show new password form
  ↓
User enters new password
  ↓
POST /api/auth/reset-password
  ↓
Verify token again
  ↓
Hash new password
  ↓
Update user password
  ↓
Delete token
  ↓
Auto-login user
  ↓
Redirect to home
```

---

## 🧪 Testing Authentication

### Manual Testing Checklist

**Registration:**
- [ ] Can register with valid email/password
- [ ] Duplicate email rejected
- [ ] Weak password rejected
- [ ] Welcome email sent
- [ ] Auto-logged in after registration

**Login:**
- [ ] Can login with correct credentials
- [ ] Wrong password rejected
- [ ] Non-existent email rejected
- [ ] Google OAuth works
- [ ] Session persists across page reloads

**Authorization:**
- [ ] Student cannot access vendor routes
- [ ] Vendor cannot access admin routes
- [ ] Unauthenticated users redirected to login
- [ ] API endpoints protected correctly

**Logout:**
- [ ] Session cleared on logout
- [ ] Redirected to login page
- [ ] Cannot access protected routes after logout

---

## 🔐 Environment Variables Reference

```bash
# Authentication
NEXTAUTH_SECRET="generated-secret-key"
NEXTAUTH_URL="http://localhost:3000" # Production: https://edubaskets.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"
DIRECT_URL="postgresql://user:pass@host:5432/db" # For migrations
```

---

## 📚 NextAuth.js Configuration Summary

**File:** `/lib/auth.ts`

**Key Configurations:**
- Session strategy: JWT
- Providers: Credentials, Google
- Session duration: 30 days
- Custom callbacks for role handling
- Custom sign-in/error pages

---

**Document Version:** 1.0  
**Last Updated:** December 27, 2024  
**Status:** APPROVED
