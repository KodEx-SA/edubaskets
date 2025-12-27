# eDuBaskets - Database Schema Design

## 📊 Database Overview

**Database Type:** PostgreSQL 15+  
**Hosting:** Neon.com (Serverless PostgreSQL)  
**ORM:** Prisma  
**Version:** 1.0 (MVP)

---

## 🎯 Schema Design Principles

1. **Normalization:** Third Normal Form (3NF) to reduce redundancy
2. **Indexing:** Strategic indexes on frequently queried fields
3. **Relationships:** Clear foreign key relationships with cascading rules
4. **Timestamps:** All tables include createdAt and updatedAt
5. **Soft Deletes:** Important records marked as deleted rather than removed
6. **Type Safety:** Enums for status fields and roles

---

## 📐 Entity Relationship Diagram (ERD)

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│   Vendor    │   │   Student   │
│   Profile   │   │   Profile   │
└──────┬──────┘   └─────────────┘
       │
       │ Creates
       ▼
┌─────────────┐
│   Hamper    │
└──────┬──────┘
       │
       │ Contains
       ▼
┌─────────────┐
│ HamperItem  │
└─────────────┘
       │
       │ Part of
       ▼
┌─────────────┐
│  OrderItem  │
└──────┬──────┘
       │
       │ Belongs to
       ▼
┌─────────────┐
│    Order    │
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│   Payment   │   │  Delivery   │
│             │   │ Assignment  │
└─────────────┘   └─────────────┘
```

---

## 📋 Complete Prisma Schema

```prisma
// This is your Prisma schema file
// Learn more: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ============================================
// ENUMS
// ============================================

enum UserRole {
  STUDENT
  VENDOR
  DRIVER
  ADMIN
}

enum OrderStatus {
  PENDING_PAYMENT    // Order created, waiting for payment
  PAYMENT_FAILED     // Payment failed
  PAID               // Payment successful
  CONFIRMED          // Vendor confirmed order
  PREPARING          // Vendor preparing hamper
  READY_FOR_PICKUP   // Ready for driver pickup
  OUT_FOR_DELIVERY   // Driver picked up, delivering
  DELIVERED          // Successfully delivered
  CANCELLED          // Order cancelled
  REFUNDED           // Order refunded
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  EFT
  INSTANT_EFT
  EWALLET
}

enum VendorStatus {
  PENDING_APPROVAL
  APPROVED
  REJECTED
  SUSPENDED
}

enum DeliveryStatus {
  PENDING
  ASSIGNED
  ACCEPTED
  PICKED_UP
  DELIVERED
  CANCELLED
}

enum HamperCategory {
  FOOD_GROCERIES
  HYGIENE_CARE
  STUDY_ESSENTIALS
  COMBO_PACK
  CUSTOM
}

// ============================================
// USER & AUTHENTICATION
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  password      String?   // Null for OAuth users
  name          String?
  image         String?
  role          UserRole  @default(STUDENT)
  phoneNumber   String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relationships
  accounts      Account[]
  sessions      Session[]
  vendor        Vendor?         // One-to-one if user is a vendor
  orders        Order[]         // Orders placed by user (as customer)
  deliveries    Delivery[]      // Deliveries assigned to user (as driver)
  notifications Notification[]

  @@index([email])
  @@index([role])
  @@map("users")
}

// NextAuth.js Models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ============================================
// VENDOR
// ============================================

model Vendor {
  id                String        @id @default(cuid())
  userId            String        @unique
  businessName      String
  businessAddress   String
  businessPhone     String
  description       String?       @db.Text
  logo              String?
  status            VendorStatus  @default(PENDING_APPROVAL)
  rating            Float         @default(0)
  totalRatings      Int           @default(0)
  
  // Location (for map display)
  latitude          Float?
  longitude         Float?
  
  // Business verification
  registrationNumber String?
  taxNumber          String?
  
  // Timestamps
  approvedAt        DateTime?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  // Relationships
  user              User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  hampers           Hamper[]
  orders            Order[]       // Orders received by this vendor
  analytics         VendorAnalytics?

  @@index([userId])
  @@index([status])
  @@map("vendors")
}

model VendorAnalytics {
  id              String   @id @default(cuid())
  vendorId        String   @unique
  totalOrders     Int      @default(0)
  totalRevenue    Float    @default(0)
  averageRating   Float    @default(0)
  completedOrders Int      @default(0)
  cancelledOrders Int      @default(0)
  updatedAt       DateTime @updatedAt

  vendor Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  @@map("vendor_analytics")
}

// ============================================
// HAMPER
// ============================================

model Hamper {
  id              String          @id @default(cuid())
  vendorId        String
  name            String
  description     String          @db.Text
  category        HamperCategory
  price           Float
  compareAtPrice  Float?          // Original price for "sale" display
  
  // Inventory
  stock           Int             @default(0)
  isAvailable     Boolean         @default(true)
  
  // Media
  images          String[]        // Array of image URLs
  
  // Customization
  allowCustomization Boolean      @default(false)
  
  // SEO & Discovery
  tags            String[]
  
  // Stats
  viewCount       Int             @default(0)
  orderCount      Int             @default(0)
  rating          Float           @default(0)
  totalRatings    Int             @default(0)
  
  // Timestamps
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  deletedAt       DateTime?       // Soft delete

  // Relationships
  vendor          Vendor          @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  items           HamperItem[]
  orderItems      OrderItem[]

  @@index([vendorId])
  @@index([category])
  @@index([isAvailable])
  @@map("hampers")
}

model HamperItem {
  id          String   @id @default(cuid())
  hamperId    String
  name        String
  quantity    Int      @default(1)
  description String?
  createdAt   DateTime @default(now())

  hamper Hamper @relation(fields: [hamperId], references: [id], onDelete: Cascade)

  @@index([hamperId])
  @@map("hamper_items")
}

// ============================================
// ORDER
// ============================================

model Order {
  id                String       @id @default(cuid())
  orderNumber       String       @unique // Human-readable: e.g., "ORD-2025-0001"
  
  // Customer info
  userId            String
  studentName       String
  studentEmail      String
  studentPhone      String
  
  // Vendor info
  vendorId          String
  
  // Delivery details
  deliveryAddress   String
  deliveryLat       Float?
  deliveryLng       Float?
  deliveryNotes     String?
  
  // Order details
  status            OrderStatus  @default(PENDING_PAYMENT)
  subtotal          Float
  deliveryFee       Float        @default(0)
  serviceFee        Float        @default(0)
  total             Float
  
  // Driver tip
  driverTip         Float        @default(0)
  
  // Estimated times
  estimatedPrepTime Int?         // Minutes
  estimatedDelivery DateTime?
  
  // Actual times
  confirmedAt       DateTime?
  preparingAt       DateTime?
  readyAt           DateTime?
  pickedUpAt        DateTime?
  deliveredAt       DateTime?
  cancelledAt       DateTime?
  
  // Timestamps
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  // Relationships
  user              User         @relation(fields: [userId], references: [id])
  vendor            Vendor       @relation(fields: [vendorId], references: [id])
  items             OrderItem[]
  payment           Payment?
  delivery          Delivery?
  statusHistory     OrderStatusHistory[]

  @@index([userId])
  @@index([vendorId])
  @@index([status])
  @@index([orderNumber])
  @@map("orders")
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  hamperId  String
  quantity  Int      @default(1)
  price     Float    // Price at time of order
  subtotal  Float    // quantity * price
  
  // Snapshot of hamper details at time of order
  hamperName        String
  hamperDescription String?
  hamperImage       String?
  
  createdAt DateTime @default(now())

  order  Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  hamper Hamper @relation(fields: [hamperId], references: [id])

  @@index([orderId])
  @@index([hamperId])
  @@map("order_items")
}

model OrderStatusHistory {
  id        String      @id @default(cuid())
  orderId   String
  status    OrderStatus
  note      String?
  createdAt DateTime    @default(now())

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
  @@map("order_status_history")
}

// ============================================
// PAYMENT
// ============================================

model Payment {
  id              String        @id @default(cuid())
  orderId         String        @unique
  
  // Payment gateway details
  paymentGateway  String        @default("PayFast")
  transactionId   String?       @unique // PayFast transaction ID
  
  // Amount
  amount          Float
  currency        String        @default("ZAR")
  
  // Status
  status          PaymentStatus @default(PENDING)
  method          PaymentMethod?
  
  // PayFast specific
  payfastData     Json?         // Store raw PayFast response
  
  // Timestamps
  initiatedAt     DateTime      @default(now())
  completedAt     DateTime?
  failedAt        DateTime?
  refundedAt      DateTime?
  
  updatedAt       DateTime      @updatedAt

  // Relationships
  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
  @@index([transactionId])
  @@index([status])
  @@map("payments")
}

// ============================================
// DELIVERY (Phase 1: Admin-managed, Phase 2: Driver app)
// ============================================

model Delivery {
  id              String         @id @default(cuid())
  orderId         String         @unique
  
  // Driver assignment (nullable for Phase 1)
  driverId        String?
  driverName      String?        // For manual/admin assignment
  driverPhone     String?
  
  // Status
  status          DeliveryStatus @default(PENDING)
  
  // Tracking
  pickupAddress   String         // Vendor address
  deliveryAddress String         // Customer address
  
  // Location tracking (Phase 2)
  currentLat      Float?
  currentLng      Float?
  
  // Distance & time
  estimatedDistance Float?       // km
  estimatedTime     Int?         // minutes
  actualDistance    Float?
  actualTime        Int?
  
  // Proof of delivery
  deliveryPhoto   String?
  deliveryNotes   String?
  signature       String?        // Base64 or URL
  
  // Timestamps
  assignedAt      DateTime?
  acceptedAt      DateTime?
  pickedUpAt      DateTime?
  deliveredAt     DateTime?
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  // Relationships
  order  Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  driver User?  @relation(fields: [driverId], references: [id])

  @@index([orderId])
  @@index([driverId])
  @@index([status])
  @@map("deliveries")
}

// ============================================
// NOTIFICATIONS
// ============================================

model Notification {
  id        String   @id @default(cuid())
  userId    String
  title     String
  message   String   @db.Text
  type      String   // "order", "payment", "delivery", "system"
  data      Json?    // Additional data (e.g., orderId)
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([isRead])
  @@map("notifications")
}

// ============================================
// REVIEWS & RATINGS (Phase 2)
// ============================================

// model Review {
//   id         String   @id @default(cuid())
//   orderId    String   @unique
//   userId     String
//   vendorId   String?
//   driverId   String?
//   rating     Int      // 1-5
//   comment    String?  @db.Text
//   images     String[]
//   createdAt  DateTime @default(now())
//   updatedAt  DateTime @updatedAt
// 
//   @@index([vendorId])
//   @@index([driverId])
//   @@map("reviews")
// }

// ============================================
// ADMIN SETTINGS
// ============================================

model AppSettings {
  id                    String   @id @default(cuid())
  key                   String   @unique
  value                 String   @db.Text
  description           String?
  updatedAt             DateTime @updatedAt

  @@map("app_settings")
}

// Example settings:
// - delivery_fee_base: "25"
// - delivery_fee_per_km: "5"
// - service_fee_percentage: "5"
// - free_delivery_threshold: "250"
```

---

## 📊 Table Descriptions

### **1. User & Authentication Tables**

#### **users**
Primary user table storing all users regardless of role.

| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Unique identifier |
| email | String | Unique email address |
| emailVerified | DateTime? | Email verification timestamp |
| password | String? | Hashed password (null for OAuth) |
| name | String? | Full name |
| image | String? | Profile picture URL |
| role | UserRole | STUDENT, VENDOR, DRIVER, ADMIN |
| phoneNumber | String? | Contact number |
| isActive | Boolean | Account active status |
| createdAt | DateTime | Registration timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- `email` (unique lookup)
- `role` (filtering by role)

#### **accounts** (NextAuth)
OAuth provider accounts linked to users.

#### **sessions** (NextAuth)
Active user sessions.

#### **verification_tokens** (NextAuth)
Email verification and password reset tokens.

---

### **2. Vendor Tables**

#### **vendors**
Extended profile for users with VENDOR role.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| userId | String | FK to users (unique) |
| businessName | String | Vendor business name |
| businessAddress | String | Physical address |
| businessPhone | String | Business contact |
| description | Text? | About the business |
| logo | String? | Business logo URL |
| status | VendorStatus | Approval status |
| rating | Float | Average rating (0-5) |
| totalRatings | Int | Number of ratings |
| latitude | Float? | Location latitude |
| longitude | Float? | Location longitude |
| approvedAt | DateTime? | Approval timestamp |

**Indexes:**
- `userId` (one-to-one relationship)
- `status` (filter pending approvals)

#### **vendor_analytics**
Aggregated metrics for vendor performance.

---

### **3. Hamper Tables**

#### **hampers**
Products (hampers) offered by vendors.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| vendorId | String | FK to vendors |
| name | String | Hamper name |
| description | Text | Detailed description |
| category | HamperCategory | Category type |
| price | Float | Current price (ZAR) |
| compareAtPrice | Float? | Original price for discounts |
| stock | Int | Available quantity |
| isAvailable | Boolean | Active listing |
| images | String[] | Array of image URLs |
| allowCustomization | Boolean | Custom orders allowed |
| tags | String[] | Search tags |
| viewCount | Int | Views counter |
| orderCount | Int | Orders counter |
| rating | Float | Average rating |
| createdAt | DateTime | Creation timestamp |
| deletedAt | DateTime? | Soft delete timestamp |

**Indexes:**
- `vendorId` (vendor's hampers)
- `category` (category filtering)
- `isAvailable` (active products)

#### **hamper_items**
Individual items within a hamper.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| hamperId | String | FK to hampers |
| name | String | Item name |
| quantity | Int | Quantity included |
| description | String? | Item details |

---

### **4. Order Tables**

#### **orders**
Main order table tracking all transactions.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| orderNumber | String | Human-readable ID (e.g., ORD-2025-0001) |
| userId | String | FK to users (customer) |
| vendorId | String | FK to vendors |
| status | OrderStatus | Current status |
| subtotal | Float | Items total |
| deliveryFee | Float | Delivery charge |
| serviceFee | Float | Platform fee |
| total | Float | Grand total |
| deliveryAddress | String | Delivery location |
| deliveryLat/Lng | Float? | GPS coordinates |
| estimatedDelivery | DateTime? | ETA |
| deliveredAt | DateTime? | Actual delivery time |

**Indexes:**
- `userId` (user's orders)
- `vendorId` (vendor's orders)
- `status` (filter by status)
- `orderNumber` (lookup by order number)

#### **order_items**
Line items in each order.

| Field | Type | Description |
|-------|------|-------------|
| orderId | String | FK to orders |
| hamperId | String | FK to hampers |
| quantity | Int | Quantity ordered |
| price | Float | Price at order time |
| subtotal | Float | Line total |
| hamperName | String | Snapshot of hamper name |

**Why snapshot data?** Preserves order details even if hamper is later modified/deleted.

#### **order_status_history**
Audit trail of all status changes.

---

### **5. Payment Tables**

#### **payments**
Payment transactions linked to orders.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| orderId | String | FK to orders (unique) |
| paymentGateway | String | "PayFast" |
| transactionId | String? | Gateway transaction ID |
| amount | Float | Payment amount |
| status | PaymentStatus | Current status |
| method | PaymentMethod? | Payment type |
| payfastData | JSON? | Raw gateway response |
| completedAt | DateTime? | Success timestamp |

**Indexes:**
- `orderId` (one-to-one with order)
- `transactionId` (gateway lookup)
- `status` (filter payments)

---

### **6. Delivery Tables**

#### **deliveries**
Delivery tracking and driver assignment.

| Field | Type | Description |
|-------|------|-------------|
| orderId | String | FK to orders (unique) |
| driverId | String? | FK to users (nullable in Phase 1) |
| driverName | String? | Manual assignment name |
| status | DeliveryStatus | Current status |
| pickupAddress | String | Vendor location |
| deliveryAddress | String | Customer location |
| currentLat/Lng | Float? | Live tracking (Phase 2) |
| deliveryPhoto | String? | Proof of delivery |
| deliveredAt | DateTime? | Completion time |

---

### **7. Notification Tables**

#### **notifications**
In-app notifications for users.

| Field | Type | Description |
|-------|------|-------------|
| userId | String | FK to users |
| title | String | Notification title |
| message | Text | Notification body |
| type | String | Category (order, payment, etc.) |
| data | JSON? | Additional context |
| isRead | Boolean | Read status |

---

### **8. Settings Tables**

#### **app_settings**
Platform-wide configuration.

| Key | Value | Description |
|-----|-------|-------------|
| delivery_fee_base | "25" | Base delivery fee (ZAR) |
| delivery_fee_per_km | "5" | Per-km charge |
| service_fee_percentage | "5" | Platform commission (%) |
| free_delivery_threshold | "250" | Free delivery over amount |

---

## 🔗 Key Relationships

```
User 1:1 Vendor         (One user can be one vendor)
User 1:N Orders         (One user places many orders)
User 1:N Deliveries     (One driver handles many deliveries)

Vendor 1:N Hampers      (One vendor sells many hampers)
Vendor 1:N Orders       (One vendor receives many orders)

Hamper 1:N HamperItems  (One hamper contains many items)
Hamper 1:N OrderItems   (One hamper appears in many orders)

Order 1:N OrderItems    (One order contains many items)
Order 1:1 Payment       (One order has one payment)
Order 1:1 Delivery      (One order has one delivery)
Order 1:N OrderStatusHistory (One order has many status updates)
```

---

## 📈 Indexes Strategy

**Why indexes matter:** Speed up queries, especially as data grows.

**Indexed Fields:**
- All foreign keys (userId, vendorId, orderId, etc.)
- Frequently filtered fields (status, role, isAvailable)
- Unique identifiers (email, orderNumber, transactionId)

**Query Examples:**
```sql
-- Fast: Index on userId
SELECT * FROM orders WHERE userId = 'xyz';

-- Fast: Index on status
SELECT * FROM orders WHERE status = 'PAID';

-- Fast: Composite index on vendorId + status
SELECT * FROM orders WHERE vendorId = 'abc' AND status = 'PREPARING';
```

---

## 🔄 Cascading Rules

**Delete Behaviors:**

| Parent | Child | Rule | Effect |
|--------|-------|------|--------|
| User | Account | CASCADE | Deleting user deletes OAuth accounts |
| User | Session | CASCADE | Deleting user deletes sessions |
| User | Vendor | CASCADE | Deleting user deletes vendor profile |
| Vendor | Hamper | CASCADE | Deleting vendor deletes their hampers |
| Hamper | HamperItem | CASCADE | Deleting hamper deletes its items |
| Order | OrderItem | CASCADE | Deleting order deletes its items |
| Order | Payment | CASCADE | Deleting order deletes payment record |

**Important:** Orders are rarely deleted. Use `cancelledAt` timestamp instead.

---

## 🚀 Migration Strategy

### **Initial Migration**

```bash
# Create Prisma schema file (schema.prisma)
# Run initial migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### **Seed Data (Development)**

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@edubaskets.com',
      name: 'Admin User',
      role: 'ADMIN',
      password: await hash('admin123'), // Hashed
    }
  })

  // Create demo vendor
  const vendor = await prisma.user.create({
    data: {
      email: 'vendor@demo.com',
      name: 'Demo Vendor',
      role: 'VENDOR',
      vendor: {
        create: {
          businessName: 'Campus Mini-Mart',
          businessAddress: '123 Campus Road',
          businessPhone: '0123456789',
          status: 'APPROVED',
        }
      }
    }
  })

  // Create demo hampers
  // ... more seed data
}

main()
```

**Run seed:**
```bash
npx prisma db seed
```

---

## 🔍 Query Examples (Prisma)

### **1. Get all available hampers with vendor info**

```typescript
const hampers = await prisma.hamper.findMany({
  where: {
    isAvailable: true,
    deletedAt: null,
  },
  include: {
    vendor: {
      select: {
        id: true,
        businessName: true,
        logo: true,
        rating: true,
      }
    },
    items: true,
  },
  orderBy: {
    orderCount: 'desc',
  },
  take: 20, // Pagination
})
```

### **2. Get user's order history**

```typescript
const orders = await prisma.order.findMany({
  where: {
    userId: currentUser.id,
  },
  include: {
    items: {
      include: {
        hamper: true,
      }
    },
    vendor: {
      select: {
        businessName: true,
        logo: true,
      }
    },
    payment: true,
    delivery: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
})
```

### **3. Vendor's pending orders**

```typescript
const pendingOrders = await prisma.order.findMany({
  where: {
    vendorId: vendor.id,
    status: {
      in: ['PAID', 'CONFIRMED'],
    }
  },
  include: {
    items: true,
    user: {
      select: {
        name: true,
        email: true,
        phoneNumber: true,
      }
    },
  },
  orderBy: {
    createdAt: 'asc',
  },
})
```

### **4. Create order with items**

```typescript
const order = await prisma.order.create({
  data: {
    orderNumber: generateOrderNumber(),
    userId: user.id,
    vendorId: vendorId,
    studentName: user.name,
    studentEmail: user.email,
    studentPhone: user.phoneNumber,
    deliveryAddress: deliveryAddress,
    status: 'PENDING_PAYMENT',
    subtotal: 150.00,
    deliveryFee: 25.00,
    serviceFee: 7.50,
    total: 182.50,
    items: {
      create: [
        {
          hamperId: 'hamper_1',
          quantity: 1,
          price: 150.00,
          subtotal: 150.00,
          hamperName: 'Late Night Study Pack',
          hamperImage: 'url...',
        }
      ]
    },
  },
  include: {
    items: true,
  }
})
```

### **5. Update order status with history**

```typescript
const updatedOrder = await prisma.order.update({
  where: { id: orderId },
  data: {
    status: 'PREPARING',
    preparingAt: new Date(),
    statusHistory: {
      create: {
        status: 'PREPARING',
        note: 'Vendor started preparing the hamper',
      }
    }
  },
})
```

---

## 📊 Performance Optimization

### **Connection Pooling (Neon)**

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### **Query Optimization Tips**

1. **Use `select` to fetch only needed fields**
```typescript
// Bad: Fetches all fields
const user = await prisma.user.findUnique({ where: { id } })

// Good: Fetch only what you need
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
  }
})
```

2. **Use pagination for large datasets**
```typescript
// Cursor-based pagination
const hampers = await prisma.hamper.findMany({
  take: 20,
  skip: 1,
  cursor: {
    id: lastHamperId,
  },
})
```

3. **Batch queries with `Promise.all`**
```typescript
const [orders, analytics, hampers] = await Promise.all([
  prisma.order.findMany({ where: { vendorId } }),
  prisma.vendorAnalytics.findUnique({ where: { vendorId } }),
  prisma.hamper.findMany({ where: { vendorId } }),
])
```

---

## 🔐 Security Considerations

1. **Never expose raw user passwords** (always hashed with bcrypt)
2. **Row-level security** - Always filter by userId/vendorId
3. **Soft deletes** for important records (use `deletedAt` field)
4. **Audit trails** - `OrderStatusHistory` tracks all changes
5. **Input validation** - Use Zod schemas before Prisma queries

---

## 📝 Next Steps

✅ **Completed:**
1. Project Charter
2. Technical Architecture
3. Database Schema ✓

**Up Next:**
4. API Endpoints Documentation
5. User Stories & Features
6. Development Roadmap (Week-by-week)
7. Component Structure
8. Authentication Flow

---

**Document Version:** 1.0  
**Last Updated:** December 27, 2024  
**Status:** APPROVED
