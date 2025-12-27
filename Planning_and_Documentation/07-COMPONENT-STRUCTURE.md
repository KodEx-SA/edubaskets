# eDuBaskets - Component Structure & Organization

## 📁 Project File Structure

```
edubaskets/
├── app/                                 # Next.js App Router
│   ├── (auth)/                         # Auth group routes
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx                  # Auth layout (no nav)
│   │
│   ├── (student)/                      # Student routes
│   │   ├── page.tsx                    # Home/Browse hampers
│   │   ├── hampers/
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Hamper details
│   │   ├── vendors/
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Vendor profile
│   │   ├── cart/
│   │   │   └── page.tsx                # Shopping cart
│   │   ├── checkout/
│   │   │   └── page.tsx                # Checkout
│   │   ├── orders/
│   │   │   ├── page.tsx                # Order history
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Order details
│   │   │       ├── track/
│   │   │       │   └── page.tsx        # Order tracking
│   │   │       └── payment/
│   │   │           ├── success/
│   │   │           │   └── page.tsx
│   │   │           └── cancel/
│   │   │               └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx                # User profile
│   │   └── layout.tsx                  # Student layout (with nav)
│   │
│   ├── (vendor)/                       # Vendor routes
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Vendor dashboard
│   │   ├── hampers/
│   │   │   ├── page.tsx                # Hamper list
│   │   │   ├── create/
│   │   │   │   └── page.tsx            # Create hamper
│   │   │   └── edit/
│   │   │       └── [id]/
│   │   │           └── page.tsx        # Edit hamper
│   │   ├── orders/
│   │   │   ├── page.tsx                # Vendor orders
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Order details
│   │   ├── analytics/
│   │   │   └── page.tsx                # Analytics dashboard
│   │   ├── profile/
│   │   │   └── page.tsx                # Business profile
│   │   └── layout.tsx                  # Vendor layout (with sidebar)
│   │
│   ├── (admin)/                        # Admin routes
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Admin dashboard
│   │   ├── users/
│   │   │   ├── page.tsx                # User list
│   │   │   └── [id]/
│   │   │       └── page.tsx            # User details
│   │   ├── vendors/
│   │   │   ├── page.tsx                # Vendor list & approvals
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Vendor details
│   │   ├── orders/
│   │   │   ├── page.tsx                # All orders
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Order management
│   │   ├── settings/
│   │   │   └── page.tsx                # Platform settings
│   │   └── layout.tsx                  # Admin layout (with sidebar)
│   │
│   ├── api/                            # API routes
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   │   └── route.ts
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts            # NextAuth handler
│   │   ├── hampers/
│   │   │   ├── route.ts                # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts            # GET, PUT, DELETE
│   │   ├── orders/
│   │   │   ├── route.ts                # GET (user's orders), POST (create)
│   │   │   └── [id]/
│   │   │       ├── route.ts            # GET (order details)
│   │   │       ├── status/
│   │   │       │   └── route.ts        # PATCH (update status)
│   │   │       └── cancel/
│   │   │           └── route.ts        # POST (cancel order)
│   │   ├── vendors/
│   │   │   ├── route.ts                # GET (list)
│   │   │   ├── register/
│   │   │   │   └── route.ts            # POST (register)
│   │   │   └── [id]/
│   │   │       ├── route.ts            # GET, PUT
│   │   │       └── analytics/
│   │   │           └── route.ts        # GET (analytics)
│   │   ├── payments/
│   │   │   ├── initiate/
│   │   │   │   └── route.ts            # POST (create payment)
│   │   │   └── verify/
│   │   │       └── route.ts            # POST (webhook)
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   └── route.ts            # GET (metrics)
│   │   │   ├── users/
│   │   │   │   └── route.ts            # GET (all users)
│   │   │   ├── vendors/
│   │   │   │   ├── pending/
│   │   │   │   │   └── route.ts        # GET (pending approvals)
│   │   │   │   └── [id]/
│   │   │   │       ├── approve/
│   │   │   │       │   └── route.ts
│   │   │   │       └── reject/
│   │   │   │           └── route.ts
│   │   │   └── orders/
│   │   │       └── route.ts            # GET (all orders)
│   │   ├── upload/
│   │   │   └── image/
│   │   │       └── route.ts            # POST (image upload)
│   │   └── notifications/
│   │       ├── route.ts                # GET (user's notifications)
│   │       └── [id]/
│   │           └── read/
│   │               └── route.ts        # PATCH (mark as read)
│   │
│   ├── layout.tsx                      # Root layout
│   ├── globals.css                     # Global styles
│   └── not-found.tsx                   # 404 page
│
├── components/                         # Reusable components
│   ├── ui/                            # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   ├── avatar.tsx
│   │   ├── skeleton.tsx
│   │   └── ...                        # Other shadcn components
│   │
│   ├── shared/                        # Shared across all roles
│   │   ├── Navbar.tsx                 # Main navigation
│   │   ├── Footer.tsx                 # Footer
│   │   ├── Logo.tsx                   # App logo
│   │   ├── LoadingSpinner.tsx         # Loading indicator
│   │   ├── ErrorBoundary.tsx          # Error boundary
│   │   ├── EmptyState.tsx             # Empty state display
│   │   ├── NotificationBell.tsx       # Notification dropdown
│   │   └── UserMenu.tsx               # User dropdown menu
│   │
│   ├── auth/                          # Authentication components
│   │   ├── LoginForm.tsx              # Login form
│   │   ├── RegisterForm.tsx           # Registration form
│   │   ├── GoogleSignInButton.tsx     # OAuth button
│   │   └── ProtectedRoute.tsx         # Route wrapper
│   │
│   ├── student/                       # Student-specific components
│   │   ├── HamperCard.tsx             # Hamper card display
│   │   ├── HamperList.tsx             # Grid of hampers
│   │   ├── HamperDetails.tsx          # Detailed hamper view
│   │   ├── ImageCarousel.tsx          # Image slider
│   │   ├── FilterBar.tsx              # Category filters
│   │   ├── SearchBar.tsx              # Search input
│   │   ├── CartItem.tsx               # Single cart item
│   │   ├── CartSummary.tsx            # Cart totals
│   │   ├── CheckoutForm.tsx           # Checkout form
│   │   ├── OrderSummary.tsx           # Order summary card
│   │   ├── OrderCard.tsx              # Order card (history)
│   │   ├── OrderTimeline.tsx          # Status timeline
│   │   └── PaymentButton.tsx          # PayFast payment trigger
│   │
│   ├── vendor/                        # Vendor-specific components
│   │   ├── Sidebar.tsx                # Vendor navigation
│   │   ├── MetricCard.tsx             # Dashboard metric display
│   │   ├── HamperForm.tsx             # Create/edit hamper form
│   │   ├── ImageUploader.tsx          # Multi-image upload
│   │   ├── HamperItemsInput.tsx       # Dynamic items input
│   │   ├── HampersTable.tsx           # Hampers list table
│   │   ├── OrdersTable.tsx            # Orders list table
│   │   ├── OrderCard.tsx              # Single order card
│   │   ├── OrderDetails.tsx           # Full order info
│   │   ├── StatusUpdateButtons.tsx    # Order status actions
│   │   ├── AnalyticsChart.tsx         # Revenue/orders charts
│   │   └── ProfileForm.tsx            # Business profile edit
│   │
│   └── admin/                         # Admin-specific components
│       ├── Sidebar.tsx                # Admin navigation
│       ├── MetricCard.tsx             # Platform metrics
│       ├── UserTable.tsx              # Users list table
│       ├── VendorApprovalCard.tsx     # Vendor approval item
│       ├── ApprovalQueue.tsx          # Pending approvals list
│       ├── DeliveryAssignmentForm.tsx # Manual delivery assignment
│       ├── OrderManagementCard.tsx    # Admin order actions
│       └── SettingsForm.tsx           # Platform settings
│
├── lib/                               # Utilities & configurations
│   ├── prisma.ts                      # Prisma client singleton
│   ├── auth.ts                        # NextAuth configuration
│   ├── socket.ts                      # Socket.io client
│   ├── payfast.ts                     # PayFast utilities
│   ├── email.ts                       # Email sending utilities
│   ├── utils.ts                       # Helper functions
│   ├── constants.ts                   # App constants
│   ├── validations/                   # Zod schemas
│   │   ├── auth.ts                    # Auth validation
│   │   ├── hamper.ts                  # Hamper validation
│   │   ├── order.ts                   # Order validation
│   │   └── vendor.ts                  # Vendor validation
│   └── api/                           # API utilities
│       ├── client.ts                  # API client setup
│       └── errors.ts                  # Error handling
│
├── hooks/                             # Custom React hooks
│   ├── useAuth.ts                     # Authentication hook
│   ├── useCart.ts                     # Shopping cart hook
│   ├── useOrders.ts                   # Orders data hook
│   ├── useHampers.ts                  # Hampers data hook
│   ├── useWebSocket.ts                # WebSocket connection
│   ├── useDebounce.ts                 # Debounce utility
│   └── useLocalStorage.ts             # Local storage helper
│
├── context/                           # React Context providers
│   ├── CartContext.tsx                # Cart state management
│   ├── WebSocketContext.tsx           # WebSocket connection
│   └── NotificationContext.tsx        # Notifications state
│
├── types/                             # TypeScript types
│   ├── index.ts                       # Main types export
│   ├── api.ts                         # API request/response types
│   ├── models.ts                      # Database model types
│   └── global.d.ts                    # Global type declarations
│
├── emails/                            # React Email templates
│   ├── OrderConfirmation.tsx          # Order confirmation email
│   ├── StatusUpdate.tsx               # Order status update
│   ├── VendorApproval.tsx             # Vendor approval email
│   ├── PaymentConfirmation.tsx        # Payment success email
│   └── WelcomeEmail.tsx               # Welcome email
│
├── prisma/                            # Prisma configuration
│   ├── schema.prisma                  # Database schema
│   ├── seed.ts                        # Seed script
│   └── migrations/                    # Migration files
│
├── public/                            # Static assets
│   ├── images/                        # Images
│   │   ├── logo.svg                   # App logo
│   │   └── placeholder.png            # Placeholder images
│   └── favicon.ico                    # Favicon
│
├── .env.example                       # Environment variables template
├── .env.local                         # Local environment variables
├── next.config.js                     # Next.js configuration
├── tailwind.config.ts                 # Tailwind configuration
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Dependencies
└── README.md                          # Project documentation
```

---

## 🧩 Component Hierarchy & Relationships

### Student Pages Hierarchy

```
StudentLayout
└── Navbar
    ├── Logo
    ├── SearchBar
    ├── NotificationBell
    └── UserMenu
└── Main Content (varies per page)
    ├── Browse Page
    │   ├── FilterBar
    │   └── HamperList
    │       └── HamperCard (multiple)
    │
    ├── Hamper Detail Page
    │   ├── ImageCarousel
    │   ├── HamperDetails
    │   └── AddToCartButton
    │
    ├── Cart Page
    │   ├── CartItem (multiple)
    │   └── CartSummary
    │
    ├── Checkout Page
    │   ├── CheckoutForm
    │   ├── OrderSummary
    │   └── PaymentButton
    │
    └── Order Detail Page
        ├── OrderTimeline
        ├── OrderDetails
        └── CancelOrderButton
└── Footer
```

---

### Vendor Pages Hierarchy

```
VendorLayout
└── Sidebar
    ├── Logo
    ├── Navigation Links
    └── LogoutButton
└── Main Content (varies per page)
    ├── Dashboard
    │   ├── MetricCard (multiple)
    │   └── OrdersTable
    │
    ├── Hampers Management
    │   └── HampersTable
    │
    ├── Create/Edit Hamper
    │   ├── HamperForm
    │   ├── ImageUploader
    │   └── HamperItemsInput
    │
    └── Orders Page
        ├── OrderCard (multiple)
        └── StatusUpdateButtons
```

---

### Admin Pages Hierarchy

```
AdminLayout
└── Sidebar
    ├── Logo
    ├── Navigation Links
    └── LogoutButton
└── Main Content (varies per page)
    ├── Dashboard
    │   └── MetricCard (multiple)
    │
    ├── Vendor Approvals
    │   └── VendorApprovalCard (multiple)
    │
    └── Orders Management
        └── OrderManagementCard (multiple)
```

---

## 📦 Key Components Detailed

### 1. HamperCard Component

**Purpose:** Display hamper preview in browse view

**Props:**
```typescript
interface HamperCardProps {
  hamper: {
    id: string
    name: string
    price: number
    images: string[]
    rating: number
    vendor: {
      businessName: string
      logo: string
    }
  }
}
```

**Features:**
- Image display
- Price formatting
- Vendor info
- Rating stars
- "Add to Cart" quick button
- Click to view details

---

### 2. CartContext Component

**Purpose:** Global shopping cart state management

**State:**
```typescript
interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

interface CartItem {
  hamperId: string
  hamperName: string
  quantity: number
  price: number
  image: string
  vendorId: string
}
```

**Methods:**
- `addItem(hamper, quantity)`
- `removeItem(hamperId)`
- `updateQuantity(hamperId, quantity)`
- `clearCart()`
- `getTotal()`

---

### 3. OrderTimeline Component

**Purpose:** Visual order status progression

**Props:**
```typescript
interface OrderTimelineProps {
  status: OrderStatus
  statusHistory: Array<{
    status: OrderStatus
    createdAt: Date
    note?: string
  }>
}
```

**Displays:**
- Checkmarks for completed steps
- Current active step highlighted
- Timestamps for each step
- Optional notes per step

---

### 4. HamperForm Component

**Purpose:** Create/edit hamper listings (vendor)

**Features:**
- Form validation (Zod)
- Multi-image upload
- Dynamic items array
- Category selection
- Price input with formatting
- Stock management
- Save draft functionality

---

### 5. WebSocketContext Component

**Purpose:** Real-time connection management

**Provides:**
- WebSocket connection state
- Emit events
- Listen to events
- Auto-reconnect logic
- Room management (join/leave)

**Usage:**
```typescript
const { socket, isConnected } = useWebSocket()

socket?.on('orderStatusUpdate', (order) => {
  // Update UI
})
```

---

## 🎨 Component Design Patterns

### Pattern 1: Container/Presentational

**Container Components** (Smart)
- Fetch data
- Manage state
- Handle business logic
- Example: `HampersListContainer`

**Presentational Components** (Dumb)
- Receive data via props
- Display UI only
- Reusable
- Example: `HamperCard`

---

### Pattern 2: Compound Components

**Example: Tabs Component**

```tsx
<Tabs defaultValue="new">
  <TabsList>
    <TabsTrigger value="new">New Orders</TabsTrigger>
    <TabsTrigger value="completed">Completed</TabsTrigger>
  </TabsList>
  <TabsContent value="new">
    <OrdersTable orders={newOrders} />
  </TabsContent>
  <TabsContent value="completed">
    <OrdersTable orders={completedOrders} />
  </TabsContent>
</Tabs>
```

---

### Pattern 3: Render Props / Children Pattern

**Example: EmptyState Component**

```tsx
<EmptyState
  title="No orders yet"
  description="Your orders will appear here"
  action={
    <Button onClick={() => router.push('/')}>
      Browse Hampers
    </Button>
  }
/>
```

---

## 🔄 Data Flow

### Student Order Flow

```
User Action (Add to Cart)
  ↓
CartContext.addItem()
  ↓
Local Storage updated
  ↓
UI re-renders
  ↓
User clicks Checkout
  ↓
API: POST /api/orders
  ↓
Database: Create Order
  ↓
Redirect to PayFast
  ↓
Payment Webhook
  ↓
Database: Update Order status
  ↓
WebSocket: Emit orderStatusUpdate
  ↓
UI updates in real-time
```

---

### Vendor Order Management Flow

```
WebSocket: orderCreated event
  ↓
VendorDashboard receives update
  ↓
New order appears in UI
  ↓
Vendor clicks "Confirm"
  ↓
API: PATCH /api/orders/[id]/status
  ↓
Database: Update status
  ↓
WebSocket: Emit statusUpdate
  ↓
Student UI updates
```

---

## 🛡️ Component Best Practices

### 1. TypeScript

Always type your components:

```typescript
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  // Component code
}
```

---

### 2. Error Boundaries

Wrap pages in error boundaries:

```typescript
'use client'

export default function HampersErrorBoundary({ 
  error,
  reset 
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

---

### 3. Loading States

Always show loading states:

```typescript
export default function HampersPage() {
  const { hampers, isLoading } = useHampers()

  if (isLoading) {
    return <HampersSkeleton />
  }

  return <HampersList hampers={hampers} />
}
```

---

### 4. Empty States

Handle empty data gracefully:

```typescript
{hampers.length === 0 ? (
  <EmptyState
    title="No hampers found"
    description="Try adjusting your filters"
  />
) : (
  <HampersList hampers={hampers} />
)}
```

---

## 🎯 Component Reusability

### Shared Components

These components are used across multiple roles:

1. **Button** - Used everywhere
2. **Card** - Used for displays
3. **Input** - Forms across all roles
4. **Badge** - Status indicators
5. **Avatar** - User/vendor images
6. **Dialog** - Confirmation dialogs
7. **Dropdown** - Menus and filters

---

### Role-Specific Components

These should NOT be shared between roles:

**Student:**
- HamperCard
- CartItem
- OrderTimeline

**Vendor:**
- HamperForm
- ImageUploader
- VendorOrderCard

**Admin:**
- VendorApprovalCard
- UserManagementTable
- PlatformMetrics

---

## 📝 Naming Conventions

**Components:** PascalCase  
`HamperCard.tsx`, `OrderTimeline.tsx`

**Hooks:** camelCase with "use" prefix  
`useAuth.ts`, `useCart.ts`

**Utils:** camelCase  
`formatPrice.ts`, `calculateTotal.ts`

**Types:** PascalCase with "Type" suffix (if needed)  
`HamperCardProps`, `OrderStatus`

**API Routes:** kebab-case folders  
`/api/hampers/[id]/route.ts`

---

**Document Version:** 1.0  
**Last Updated:** December 27, 2024  
**Status:** APPROVED
