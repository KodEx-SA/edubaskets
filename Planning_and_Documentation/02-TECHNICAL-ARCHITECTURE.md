# eDuBaskets - Technical Architecture Document

## 📐 System Architecture Overview

**Architecture Type:** Monolithic Full-Stack Application with Real-time Capabilities  
**Deployment Model:** Serverless (Vercel) + Managed Database (Neon)  
**Version:** 1.0 (MVP)

---

## 🏗️ High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Student    │  │   Vendor     │  │    Admin     │      │
│  │  Mobile Web  │  │   Desktop    │  │   Desktop    │      │
│  │   (PWA)      │  │     Web      │  │     Web      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┴──────────────────┘              │
│                            │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                     Next.js 14 App                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   Frontend (React)                     │  │
│  │  • Student Pages    • Vendor Dashboard                │  │
│  │  • Admin Panel      • Shared Components               │  │
│  └───────────────────────────────────────────────────────┘  │
│                             │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  API Routes (Node.js)                  │  │
│  │  • /api/auth/*       • /api/hampers/*                 │  │
│  │  • /api/orders/*     • /api/vendors/*                 │  │
│  │  • /api/admin/*      • /api/payments/*                │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└────────────────────────────┬────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│   DATA LAYER     │  │  AUTH LAYER  │  │ REALTIME     │
├──────────────────┤  ├──────────────┤  ├──────────────┤
│                  │  │              │  │              │
│  PostgreSQL      │  │  NextAuth.js │  │ WebSockets   │
│  (Neon.com)      │  │  + Firebase  │  │ (Socket.io)  │
│                  │  │              │  │              │
│  • Users         │  │ • Email/Pass │  │ • Order      │
│  • Hampers       │  │ • Google     │  │   Updates    │
│  • Orders        │  │ • Session    │  │ • Status     │
│  • Vendors       │  │   Management │  │   Changes    │
│                  │  │              │  │              │
└──────────────────┘  └──────────────┘  └──────────────┘
```

---

## 🔧 Technology Stack Details

### **Frontend Technologies**

**Framework & Core:**
- **Next.js 14.2+** (App Router, Server Components)
- **React 18+** with Server/Client Components
- **TypeScript 5+** (Strict mode)

**Styling & UI:**
- **Tailwind CSS v4** (JIT compilation)
- **shadcn/ui** (Pre-built accessible components)
- **Lucide React** (Icon library)
- **Framer Motion** (Animations - optional)

**State Management:**
- **React Server Components** (Server state)
- **React Context** (Client state - cart, UI state)
- **Zustand** (If needed for complex client state)

**Forms & Validation:**
- **React Hook Form** (Form management)
- **Zod** (Schema validation)

**Data Fetching:**
- **Server Actions** (Mutations)
- **Fetch API** with Next.js caching
- **SWR** or **TanStack Query** (Client-side data fetching - if needed)

---

### **Backend Technologies**

**Runtime & Framework:**
- **Node.js 20+** (LTS)
- **Next.js API Routes** (Serverless functions)

**Database & ORM:**
- **PostgreSQL 15+** (Neon.com managed)
- **Prisma ORM** (Type-safe database client)
  - Migrations
  - Schema management
  - Query optimization

**Authentication:**
- **NextAuth.js v5** (Auth.js)
  - Credentials provider (Email/Password)
  - Google OAuth provider
  - Session management (JWT + Database sessions)
  - Role-based access control (RBAC)

**Real-time Communication:**
- **Socket.io** (WebSocket server)
  - Order status updates
  - New order notifications for vendors
  - Delivery status updates

**File Storage:**
- **Vercel Blob** or **Cloudinary**
  - Hamper images
  - Vendor logos
  - User profile pictures
  - Optimized image delivery

---

### **Third-Party Integrations**

**Payment Processing:**
- **PayFast** (South African payment gateway)
  - Credit/Debit cards
  - EFT
  - Instant EFT
  - Webhooks for payment verification

**Email Services:**
- **Resend** (Primary choice - developer-friendly)
  - Order confirmations
  - Order status updates
  - Welcome emails
  - Password resets
- **Backup:** SendGrid

**Authentication:**
- **Firebase Authentication** (Google OAuth)
- **NextAuth.js** (Unified auth layer)

**Future (Phase 2):**
- **Google Maps JavaScript API** (Map visualization)
- **Google Maps Directions API** (Route calculation)
- **Twilio** or **Africa's Talking** (SMS notifications)
- **Firebase Cloud Messaging** (Push notifications)

---

## 🗄️ Database Architecture

### **Connection & Pooling**

```typescript
// Neon Serverless PostgreSQL
Database: PostgreSQL 15
Host: Neon.com (Auto-scaling, serverless)
Connection Pooling: Enabled (Neon built-in pooling)
Max Connections: 100 (Neon free tier)
SSL: Required
```

### **Prisma Schema Structure**

```prisma
// Core Models Overview

User (Student, Vendor, Admin, Driver)
├── Profile
├── Orders (as customer)
├── Vendor (if role = VENDOR)
└── DeliveryAssignments (if role = DRIVER)

Vendor
├── Hampers
├── Orders (received)
└── Analytics

Hamper
├── HamperItems
├── Images
└── OrderItems

Order
├── OrderItems
├── Payment
└── DeliveryAssignment
```

**Detailed schema in separate document: `03-DATABASE-SCHEMA.md`**

---

## 🔐 Authentication & Authorization Flow

### **Authentication Methods**

1. **Email/Password** (Traditional)
   - Hashed with bcrypt (10 rounds)
   - Email verification required
   - Password reset via email token

2. **Google OAuth 2.0**
   - Firebase Authentication
   - Auto-create user account on first login

3. **Student ID (Future)**
   - University SSO integration (Phase 2)

### **Authorization Levels**

```typescript
enum UserRole {
  STUDENT   // Can browse and order
  VENDOR    // Can create hampers and manage orders
  DRIVER    // Can accept and deliver orders (Phase 2)
  ADMIN     // Full platform access
}

// Route Protection
Middleware checks:
- Is user authenticated?
- Does user have required role?
- Does user own the resource?
```

### **Session Management**

```typescript
// NextAuth.js Configuration
Session Strategy: "jwt" (for serverless)
JWT Signing Algorithm: HS256
Session Max Age: 30 days
Refresh Token: Automatic (NextAuth handles)

// Database Sessions (Optional upgrade)
- Store sessions in PostgreSQL
- Better security and control
- Ability to revoke sessions
```

---

## 🌐 API Architecture

### **API Structure**

```
/api
├── /auth
│   ├── /register          POST   (Create new user)
│   ├── /login             POST   (Email/password login)
│   ├── /logout            POST   (Destroy session)
│   └── /me                GET    (Get current user)
│
├── /hampers
│   ├── /                  GET    (List all hampers - with filters)
│   ├── /[id]              GET    (Get single hamper)
│   ├── /create            POST   (Vendor: Create hamper)
│   ├── /[id]/update       PUT    (Vendor: Update hamper)
│   └── /[id]/delete       DELETE (Vendor: Delete hamper)
│
├── /orders
│   ├── /                  GET    (User: My orders / Vendor: Received orders)
│   ├── /create            POST   (Create new order)
│   ├── /[id]              GET    (Get order details)
│   ├── /[id]/status       PATCH  (Update order status)
│   └── /[id]/cancel       POST   (Cancel order)
│
├── /vendors
│   ├── /                  GET    (List all vendors)
│   ├── /[id]              GET    (Get vendor details)
│   ├── /register          POST   (Register as vendor)
│   └── /[id]/analytics    GET    (Vendor: Get analytics)
│
├── /payments
│   ├── /initiate          POST   (Create PayFast payment)
│   ├── /verify            POST   (Verify payment - webhook)
│   └── /[orderId]/status  GET    (Check payment status)
│
├── /admin
│   ├── /dashboard         GET    (Platform metrics)
│   ├── /users             GET    (List all users)
│   ├── /vendors/pending   GET    (Pending vendor approvals)
│   ├── /vendors/[id]/approve POST (Approve vendor)
│   └── /orders            GET    (All orders)
│
└── /upload
    └── /image             POST   (Upload images to Vercel Blob)
```

**Detailed API specs in separate document: `04-API-ENDPOINTS.md`**

---

## 🔄 Data Flow Diagrams

### **1. Student Orders Hamper Flow**

```
┌──────────┐
│ Student  │
└────┬─────┘
     │ 1. Browse hampers
     ▼
┌─────────────────┐
│ GET /api/hampers│
└────┬────────────┘
     │ 2. Returns hamper list
     ▼
┌──────────┐
│ Database │ ◄─── Prisma queries Hamper table
└──────────┘
     │ 3. Select hamper, add to cart
     ▼
┌──────────┐
│  Cart    │ (Client-side React Context)
└────┬─────┘
     │ 4. Checkout
     ▼
┌──────────────────────┐
│ POST /api/orders     │
│ {hampers, address}   │
└────┬─────────────────┘
     │ 5. Create order in DB
     ▼
┌──────────┐
│ Database │ ◄─── Insert Order, OrderItems
└────┬─────┘
     │ 6. Create payment
     ▼
┌──────────────────────┐
│ POST /api/payments   │
│ {orderId, amount}    │
└────┬─────────────────┘
     │ 7. Redirect to PayFast
     ▼
┌──────────┐
│ PayFast  │
└────┬─────┘
     │ 8. Payment webhook
     ▼
┌──────────────────────┐
│ POST /api/payments/  │
│ verify               │
└────┬─────────────────┘
     │ 9. Update order status
     ▼
┌──────────┐
│ Database │ ◄─── Update Order.status = "PAID"
└────┬─────┘
     │ 10. WebSocket notification
     ▼
┌──────────┐   ┌──────────┐
│ Student  │   │  Vendor  │ (Both receive updates)
└──────────┘   └──────────┘
```

### **2. Real-time Order Updates Flow**

```
┌──────────┐
│  Vendor  │
└────┬─────┘
     │ 1. Confirm order
     ▼
┌────────────────────────────┐
│ PATCH /api/orders/[id]     │
│ {status: "PREPARING"}      │
└────┬───────────────────────┘
     │ 2. Update database
     ▼
┌──────────┐
│ Database │ ◄─── Update Order.status
└────┬─────┘
     │ 3. Trigger WebSocket event
     ▼
┌──────────────────┐
│ Socket.io Server │
└────┬─────────────┘
     │ 4. Emit "orderStatusUpdate" event
     ├──────────────────┐
     ▼                  ▼
┌──────────┐      ┌──────────┐
│ Student  │      │  Admin   │
│ (receives│      │ (receives│
│  update) │      │  update) │
└──────────┘      └──────────┘
     │
     │ 5. Update UI in real-time
     ▼
┌──────────────┐
│ Order Status │
│ Timeline UI  │
└──────────────┘
```

---

## 🎨 Frontend Architecture

### **Component Structure**

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group (login, register)
│   │   ├── login/
│   │   └── register/
│   │
│   ├── (student)/                # Student routes
│   │   ├── page.tsx              # Home/Browse hampers
│   │   ├── hampers/
│   │   │   └── [id]/page.tsx    # Hamper detail page
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   └── profile/
│   │
│   ├── (vendor)/                 # Vendor dashboard routes
│   │   ├── dashboard/
│   │   ├── hampers/
│   │   │   ├── create/
│   │   │   └── edit/[id]/
│   │   ├── orders/
│   │   └── analytics/
│   │
│   ├── (admin)/                  # Admin panel routes
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── vendors/
│   │   └── orders/
│   │
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── hampers/
│   │   ├── orders/
│   │   └── [...all endpoints]
│   │
│   └── layout.tsx                # Root layout
│
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── [...shadcn components]
│   │
│   ├── shared/                   # Shared across roles
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── student/                  # Student-specific
│   │   ├── HamperCard.tsx
│   │   ├── HamperList.tsx
│   │   ├── CartItem.tsx
│   │   ├── OrderTimeline.tsx
│   │   └── FilterBar.tsx
│   │
│   ├── vendor/                   # Vendor-specific
│   │   ├── HamperForm.tsx
│   │   ├── OrderCard.tsx
│   │   ├── AnalyticsChart.tsx
│   │   └── ImageUploader.tsx
│   │
│   └── admin/                    # Admin-specific
│       ├── UserTable.tsx
│       ├── MetricCard.tsx
│       └── ApprovalQueue.tsx
│
├── lib/                          # Utilities and configurations
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # NextAuth config
│   ├── socket.ts                 # Socket.io client
│   ├── validations/              # Zod schemas
│   │   ├── auth.ts
│   │   ├── hamper.ts
│   │   └── order.ts
│   └── utils.ts                  # Helper functions
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useOrders.ts
│   └── useWebSocket.ts
│
├── context/                      # React Context providers
│   ├── CartContext.tsx
│   └── WebSocketContext.tsx
│
├── types/                        # TypeScript types
│   ├── index.ts
│   ├── api.ts
│   └── models.ts
│
└── styles/
    └── globals.css               # Global styles + Tailwind
```

---

## 🔌 WebSocket Implementation

### **Socket.io Setup**

**Server-side** (`/api/socket/route.ts`):
```typescript
import { Server } from 'socket.io'

export function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Join room based on user role
    socket.on('join', (userId, role) => {
      socket.join(`user_${userId}`)
      if (role === 'VENDOR') socket.join('vendors')
      if (role === 'ADMIN') socket.join('admins')
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  return io
}
```

**Client-side** (`hooks/useWebSocket.ts`):
```typescript
import { useEffect } from 'react'
import { io } from 'socket.io-client'

export function useWebSocket(userId: string) {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL)

    socket.on('connect', () => {
      socket.emit('join', userId)
    })

    socket.on('orderStatusUpdate', (order) => {
      // Update UI with new order status
    })

    return () => {
      socket.disconnect()
    }
  }, [userId])
}
```

**Events:**
- `orderCreated` → Notify vendor of new order
- `orderStatusUpdate` → Notify student of status change
- `paymentVerified` → Confirm payment to all parties
- `orderCancelled` → Notify cancellation

---

## 💳 Payment Integration Architecture

### **PayFast Flow**

```
1. Student clicks "Place Order"
   ↓
2. Create Order in database (status: "PENDING_PAYMENT")
   ↓
3. Generate PayFast payment request
   - merchant_id
   - merchant_key
   - amount
   - item_name
   - return_url
   - cancel_url
   - notify_url (webhook)
   ↓
4. Redirect to PayFast payment page
   ↓
5. Student completes payment
   ↓
6. PayFast sends webhook to notify_url
   ↓
7. Verify payment signature
   ↓
8. Update Order status to "PAID"
   ↓
9. Send email confirmation
   ↓
10. WebSocket notification to student & vendor
```

**Security:**
- Verify PayFast webhook signature
- Check payment amount matches order total
- Idempotent payment processing (prevent double-processing)

---

## 📧 Email Notification System

### **Resend Integration**

**Trigger Points:**
1. **Registration:** Welcome email
2. **Order Created:** Order confirmation (Student + Vendor)
3. **Payment Verified:** Payment receipt
4. **Order Status Changed:** Status update emails
5. **Order Delivered:** Delivery confirmation
6. **Password Reset:** Reset link email

**Email Templates:**
- React Email components (type-safe, previews)
- Branded design matching eDuBaskets theme
- Transactional (no marketing content in MVP)

---

## 🚀 Deployment Architecture

### **Vercel Deployment**

**Frontend + API:**
- Automatic deployments from GitHub
- Preview deployments for PRs
- Production domain: `edubaskets.vercel.app` (or custom domain)
- Serverless functions (API routes)
- Edge caching for static assets

**Environment Variables:**
```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." (for Prisma migrations)

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://edubaskets.vercel.app"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# PayFast
PAYFAST_MERCHANT_ID="..."
PAYFAST_MERCHANT_KEY="..."
PAYFAST_PASSPHRASE="..."
PAYFAST_SANDBOX="true" (false in production)

# Email
RESEND_API_KEY="..."

# Storage
BLOB_READ_WRITE_TOKEN="..." (Vercel Blob)

# WebSocket (if using separate server)
WS_URL="wss://..."
```

---

## 🔒 Security Architecture

### **Security Measures**

**Authentication:**
- JWT tokens with 30-day expiry
- HTTPS only (enforced)
- HTTP-only cookies for session tokens
- CSRF protection (NextAuth built-in)

**Authorization:**
- Route middleware for role-based access
- API route protection (check user role)
- Resource ownership validation

**Data Protection:**
- Input validation with Zod schemas
- SQL injection prevention (Prisma parameterized queries)
- XSS prevention (React auto-escaping)
- Rate limiting on sensitive endpoints

**Payment Security:**
- PayFast signature verification
- No credit card storage (PCI compliance)
- HTTPS for all payment flows

**File Uploads:**
- File type validation (images only)
- File size limits (5MB max)
- Malware scanning (future)
- Secure storage (Vercel Blob with access control)

---

## 📊 Performance Optimization

### **Frontend Optimization**

- **Next.js Image Optimization:** Automatic responsive images
- **Code Splitting:** Route-based automatic splitting
- **Server Components:** Reduce client-side JavaScript
- **Static Generation:** Pre-render static pages where possible
- **Edge Caching:** Vercel Edge Network

### **Database Optimization**

- **Indexing:** Indexes on frequently queried fields
- **Connection Pooling:** Neon built-in pooling
- **Query Optimization:** Prisma query analysis
- **Pagination:** Cursor-based pagination for large datasets

### **API Optimization**

- **Caching:** Next.js fetch caching
- **Compression:** Gzip/Brotli compression
- **Response Optimization:** Only return needed fields

---

## 📈 Monitoring & Logging

### **Tools (MVP)**

**Vercel Analytics:**
- Page view tracking
- Performance metrics
- Error tracking

**Prisma Studio:**
- Database inspection
- Manual data management

**Console Logging:**
- Server-side logs
- Error tracking

### **Future (Phase 2)**

- **Sentry:** Error tracking and monitoring
- **LogRocket:** Session replay
- **Posthog:** Product analytics

---

## 🔄 Development Workflow

### **Git Workflow**

```
main (production)
  ↑
  └── develop (staging)
        ↑
        ├── feature/student-auth
        ├── feature/vendor-dashboard
        ├── feature/payment-integration
        └── feature/[feature-name]
```

**Branch Naming:**
- `feature/[feature-name]` (new features)
- `fix/[bug-name]` (bug fixes)
- `refactor/[component-name]` (code improvements)
- `docs/[doc-name]` (documentation)

**Commit Convention:**
```
feat: Add student login page
fix: Resolve payment webhook error
refactor: Optimize hamper query performance
docs: Update API documentation
```

---

## ✅ Testing Strategy

### **MVP Testing**

**Manual Testing:**
- End-to-end user flows
- Cross-browser testing (Chrome, Safari, Firefox)
- Mobile responsive testing

**Automated Testing (Future):**
- Unit tests (Jest + React Testing Library)
- Integration tests (Playwright)
- API tests (Supertest)

---

## 📝 Documentation Standards

All code should include:
- **JSDoc comments** for functions
- **TypeScript types** for all data
- **README files** for major features
- **API documentation** (separate doc)

---

## 🎯 Next Steps

✅ **Completed:**
1. Project Charter
2. Technical Architecture Document

**Up Next:**
3. Database Schema Design (`03-DATABASE-SCHEMA.md`)
4. API Endpoints Documentation (`04-API-ENDPOINTS.md`)
5. User Stories & Features (`05-USER-STORIES.md`)
6. Development Roadmap (`06-DEVELOPMENT-ROADMAP.md`)
7. Component Structure (`07-COMPONENT-STRUCTURE.md`)
8. Authentication Flow (`08-AUTHENTICATION-FLOW.md`)

---

**Document Version:** 1.0  
**Last Updated:** December 27, 2024  
**Status:** APPROVED
