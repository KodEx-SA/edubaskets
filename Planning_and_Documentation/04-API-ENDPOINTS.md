# eDuBaskets - API Endpoints Documentation

## 🌐 API Overview

**Base URL:** `https://edubaskets.vercel.app/api`  
**Version:** v1 (MVP)  
**Authentication:** JWT (NextAuth.js)  
**Content Type:** `application/json`

---

## 🔐 Authentication

All authenticated endpoints require a valid session token (JWT).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Authentication Levels:**
- 🔓 **Public** - No authentication required
- 🔒 **Authenticated** - Any logged-in user
- 👨‍🎓 **Student** - STUDENT role required
- 🏪 **Vendor** - VENDOR role required
- 🚗 **Driver** - DRIVER role required
- 👑 **Admin** - ADMIN role required

---

## 📋 Authentication Endpoints

### **POST /api/auth/register**
Register a new user account.

**Access:** 🔓 Public

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "0812345678",
  "role": "STUDENT"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "clx123",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "STUDENT"
  }
}
```

**Errors:**
- 400: Email already exists
- 400: Invalid password (min 8 chars)
- 400: Validation error

---

### **POST /api/auth/login**
Login with email and password.

**Access:** 🔓 Public

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "clx123",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "STUDENT"
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- 401: Invalid credentials
- 403: Account not active

---

### **POST /api/auth/logout**
Logout current user.

**Access:** 🔒 Authenticated

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### **GET /api/auth/session**
Get current user session.

**Access:** 🔒 Authenticated

**Response (200):**
```json
{
  "user": {
    "id": "clx123",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "STUDENT",
    "image": "https://...",
    "phoneNumber": "0812345678"
  }
}
```

---

## 🎁 Hamper Endpoints

### **GET /api/hampers**
List all available hampers with filters.

**Access:** 🔓 Public

**Query Parameters:**
- `category` (optional): Filter by category
- `vendorId` (optional): Filter by vendor
- `search` (optional): Search in name/description
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example:**
```
GET /api/hampers?category=FOOD_GROCERIES&maxPrice=200&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "hamper_1",
      "name": "Late Night Study Pack",
      "description": "Fuel your late-night study sessions",
      "category": "FOOD_GROCERIES",
      "price": 150.00,
      "compareAtPrice": 180.00,
      "stock": 25,
      "isAvailable": true,
      "images": ["https://..."],
      "rating": 4.7,
      "totalRatings": 45,
      "vendor": {
        "id": "vendor_1",
        "businessName": "Campus Mini-Mart",
        "logo": "https://...",
        "rating": 4.5
      },
      "items": [
        {
          "name": "Noodles",
          "quantity": 4
        },
        {
          "name": "Energy Drink",
          "quantity": 2
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

### **GET /api/hampers/:id**
Get single hamper details.

**Access:** 🔓 Public

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "hamper_1",
    "name": "Late Night Study Pack",
    "description": "Fuel your late-night study sessions...",
    "category": "FOOD_GROCERIES",
    "price": 150.00,
    "compareAtPrice": 180.00,
    "stock": 25,
    "isAvailable": true,
    "images": ["https://..."],
    "allowCustomization": false,
    "tags": ["food", "study", "snacks"],
    "rating": 4.7,
    "totalRatings": 45,
    "viewCount": 1250,
    "orderCount": 87,
    "vendor": {
      "id": "vendor_1",
      "businessName": "Campus Mini-Mart",
      "businessAddress": "123 Campus Road",
      "businessPhone": "0123456789",
      "logo": "https://...",
      "rating": 4.5,
      "totalRatings": 120
    },
    "items": [
      {
        "id": "item_1",
        "name": "Noodles",
        "quantity": 4,
        "description": "Instant noodles"
      },
      {
        "id": "item_2",
        "name": "Energy Drink",
        "quantity": 2,
        "description": "250ml cans"
      }
    ]
  }
}
```

**Errors:**
- 404: Hamper not found

---

### **POST /api/hampers**
Create a new hamper (Vendor only).

**Access:** 🏪 Vendor

**Request:**
```json
{
  "name": "Essential Hygiene Kit",
  "description": "Complete hygiene essentials for students",
  "category": "HYGIENE_CARE",
  "price": 180.00,
  "compareAtPrice": 220.00,
  "stock": 50,
  "images": ["https://..."],
  "allowCustomization": false,
  "tags": ["hygiene", "toiletries", "essentials"],
  "items": [
    {
      "name": "Toothpaste",
      "quantity": 1,
      "description": "75ml tube"
    },
    {
      "name": "Soap",
      "quantity": 2,
      "description": "125g bars"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Hamper created successfully",
  "data": {
    "id": "hamper_2",
    "name": "Essential Hygiene Kit",
    ...
  }
}
```

**Errors:**
- 401: Unauthorized (not vendor)
- 400: Validation error
- 403: Vendor not approved

---

### **PUT /api/hampers/:id**
Update hamper (Vendor only, own hampers).

**Access:** 🏪 Vendor

**Request:**
```json
{
  "price": 160.00,
  "stock": 30,
  "isAvailable": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Hamper updated successfully",
  "data": { ... }
}
```

**Errors:**
- 401: Unauthorized
- 403: Not your hamper
- 404: Hamper not found

---

### **DELETE /api/hampers/:id**
Delete hamper (soft delete).

**Access:** 🏪 Vendor

**Response (200):**
```json
{
  "success": true,
  "message": "Hamper deleted successfully"
}
```

---

## 🛒 Order Endpoints

### **GET /api/orders**
Get user's orders (Student view) or received orders (Vendor view).

**Access:** 🔒 Authenticated

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200) - Student:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order_1",
      "orderNumber": "ORD-2025-0001",
      "status": "DELIVERED",
      "total": 182.50,
      "deliveryAddress": "Campus Dorm B, Room 301",
      "estimatedDelivery": "2025-01-15T14:30:00Z",
      "deliveredAt": "2025-01-15T14:25:00Z",
      "vendor": {
        "businessName": "Campus Mini-Mart",
        "logo": "https://..."
      },
      "items": [
        {
          "hamperName": "Late Night Study Pack",
          "quantity": 1,
          "price": 150.00,
          "hamperImage": "https://..."
        }
      ],
      "payment": {
        "status": "COMPLETED",
        "method": "CREDIT_CARD"
      },
      "createdAt": "2025-01-15T13:00:00Z"
    }
  ]
}
```

---

### **GET /api/orders/:id**
Get detailed order information.

**Access:** 🔒 Authenticated (own order or vendor's order)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "order_1",
    "orderNumber": "ORD-2025-0001",
    "status": "OUT_FOR_DELIVERY",
    "studentName": "John Doe",
    "studentEmail": "john@example.com",
    "studentPhone": "0812345678",
    "deliveryAddress": "Campus Dorm B, Room 301",
    "deliveryLat": -25.7479,
    "deliveryLng": 28.2293,
    "deliveryNotes": "Call when you arrive",
    "subtotal": 150.00,
    "deliveryFee": 25.00,
    "serviceFee": 7.50,
    "driverTip": 10.00,
    "total": 192.50,
    "estimatedDelivery": "2025-01-15T14:30:00Z",
    "vendor": {
      "id": "vendor_1",
      "businessName": "Campus Mini-Mart",
      "businessPhone": "0123456789"
    },
    "items": [
      {
        "hamperId": "hamper_1",
        "hamperName": "Late Night Study Pack",
        "quantity": 1,
        "price": 150.00,
        "subtotal": 150.00,
        "hamperImage": "https://..."
      }
    ],
    "payment": {
      "status": "COMPLETED",
      "method": "CREDIT_CARD",
      "transactionId": "PF12345",
      "completedAt": "2025-01-15T13:05:00Z"
    },
    "delivery": {
      "status": "OUT_FOR_DELIVERY",
      "driverName": "Sarah L",
      "driverPhone": "0823456789",
      "pickupAddress": "123 Campus Road",
      "estimatedTime": 25
    },
    "statusHistory": [
      {
        "status": "PENDING_PAYMENT",
        "createdAt": "2025-01-15T13:00:00Z"
      },
      {
        "status": "PAID",
        "createdAt": "2025-01-15T13:05:00Z"
      },
      {
        "status": "CONFIRMED",
        "createdAt": "2025-01-15T13:10:00Z",
        "note": "Vendor confirmed order"
      },
      {
        "status": "PREPARING",
        "createdAt": "2025-01-15T13:15:00Z"
      },
      {
        "status": "OUT_FOR_DELIVERY",
        "createdAt": "2025-01-15T14:00:00Z"
      }
    ],
    "createdAt": "2025-01-15T13:00:00Z"
  }
}
```

---

### **POST /api/orders**
Create a new order.

**Access:** 👨‍🎓 Student

**Request:**
```json
{
  "vendorId": "vendor_1",
  "items": [
    {
      "hamperId": "hamper_1",
      "quantity": 1
    }
  ],
  "deliveryAddress": "Campus Dorm B, Room 301",
  "deliveryLat": -25.7479,
  "deliveryLng": 28.2293,
  "deliveryNotes": "Call when you arrive",
  "driverTip": 10.00
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "order_1",
    "orderNumber": "ORD-2025-0001",
    "status": "PENDING_PAYMENT",
    "total": 192.50,
    "paymentUrl": "https://payfast.co.za/eng/process?..."
  }
}
```

**Errors:**
- 400: Invalid items or out of stock
- 400: Vendor not approved
- 401: Unauthorized

---

### **PATCH /api/orders/:id/status**
Update order status (Vendor/Admin only).

**Access:** 🏪 Vendor or 👑 Admin

**Request:**
```json
{
  "status": "PREPARING",
  "note": "Started preparing your order"
}
```

**Valid Status Transitions:**
- Vendor: PAID → CONFIRMED → PREPARING → READY_FOR_PICKUP
- Driver: READY_FOR_PICKUP → OUT_FOR_DELIVERY → DELIVERED
- Any: → CANCELLED

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "id": "order_1",
    "status": "PREPARING",
    ...
  }
}
```

**Errors:**
- 400: Invalid status transition
- 403: Not authorized for this order

---

### **POST /api/orders/:id/cancel**
Cancel an order.

**Access:** 🔒 Authenticated (customer or vendor)

**Request:**
```json
{
  "reason": "Changed my mind"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

**Errors:**
- 400: Cannot cancel (already delivered/preparing)
- 403: Not authorized

---

## 🏪 Vendor Endpoints

### **GET /api/vendors**
List all approved vendors.

**Access:** 🔓 Public

**Query Parameters:**
- `search` (optional): Search business name
- `page` (optional)
- `limit` (optional)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "vendor_1",
      "businessName": "Campus Mini-Mart",
      "description": "Your one-stop shop for campus essentials",
      "businessAddress": "123 Campus Road",
      "logo": "https://...",
      "rating": 4.5,
      "totalRatings": 120,
      "hamperCount": 15
    }
  ]
}
```

---

### **GET /api/vendors/:id**
Get vendor details with hampers.

**Access:** 🔓 Public

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "vendor_1",
    "businessName": "Campus Mini-Mart",
    "description": "Your one-stop shop...",
    "businessAddress": "123 Campus Road",
    "businessPhone": "0123456789",
    "logo": "https://...",
    "rating": 4.5,
    "totalRatings": 120,
    "hampers": [
      {
        "id": "hamper_1",
        "name": "Late Night Study Pack",
        "price": 150.00,
        "images": ["https://..."],
        "rating": 4.7
      }
    ]
  }
}
```

---

### **POST /api/vendors/register**
Register as a vendor.

**Access:** 🔒 Authenticated

**Request:**
```json
{
  "businessName": "Campus Mini-Mart",
  "businessAddress": "123 Campus Road",
  "businessPhone": "0123456789",
  "description": "Your one-stop shop for campus essentials",
  "latitude": -25.7479,
  "longitude": 28.2293,
  "registrationNumber": "2024/123456/07",
  "taxNumber": "9876543210"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Vendor application submitted. Awaiting approval.",
  "data": {
    "id": "vendor_1",
    "status": "PENDING_APPROVAL"
  }
}
```

---

### **GET /api/vendors/:id/analytics**
Get vendor analytics (Own vendor only).

**Access:** 🏪 Vendor

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "totalRevenue": 22500.00,
    "completedOrders": 142,
    "cancelledOrders": 8,
    "averageRating": 4.5,
    "topSellingHampers": [
      {
        "hamperId": "hamper_1",
        "name": "Late Night Study Pack",
        "orderCount": 45,
        "revenue": 6750.00
      }
    ],
    "recentOrders": [...]
  }
}
```

---

## 💳 Payment Endpoints

### **POST /api/payments/initiate**
Create PayFast payment for an order.

**Access:** 👨‍🎓 Student (own order)

**Request:**
```json
{
  "orderId": "order_1"
}
```

**Response (200):**
```json
{
  "success": true,
  "paymentUrl": "https://sandbox.payfast.co.za/eng/process?...",
  "paymentData": {
    "merchant_id": "10000100",
    "merchant_key": "46f0cd694581a",
    "amount": "192.50",
    "item_name": "Order ORD-2025-0001",
    "return_url": "https://edubaskets.com/orders/order_1/payment/success",
    "cancel_url": "https://edubaskets.com/orders/order_1/payment/cancel",
    "notify_url": "https://edubaskets.com/api/payments/verify"
  }
}
```

---

### **POST /api/payments/verify**
PayFast webhook - verify payment (Internal, called by PayFast).

**Access:** 🔓 Public (Webhook)

**Request (from PayFast):**
```
m_payment_id=order_1
pf_payment_id=1234567
payment_status=COMPLETE
item_name=Order ORD-2025-0001
amount_gross=192.50
signature=abc123...
```

**Processing:**
1. Verify PayFast signature
2. Validate payment amount
3. Update Order status to "PAID"
4. Create Payment record
5. Send email confirmation
6. Emit WebSocket event

**Response (200):**
```
OK
```

---

### **GET /api/payments/:orderId/status**
Check payment status for an order.

**Access:** 🔒 Authenticated (own order)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orderId": "order_1",
    "status": "COMPLETED",
    "transactionId": "PF12345",
    "amount": 192.50,
    "method": "CREDIT_CARD",
    "completedAt": "2025-01-15T13:05:00Z"
  }
}
```

---

## 👑 Admin Endpoints

### **GET /api/admin/dashboard**
Get platform-wide metrics.

**Access:** 👑 Admin

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalOrders": 1540,
    "totalRevenue": 231000.00,
    "platformRevenue": 11550.00,
    "activeUsers": 1200,
    "totalStudents": 1050,
    "totalVendors": 25,
    "totalDrivers": 45,
    "pendingVendorApprovals": 5,
    "ordersToday": 87,
    "revenueToday": 13050.00,
    "ordersByStatus": {
      "PENDING_PAYMENT": 12,
      "PAID": 8,
      "PREPARING": 15,
      "OUT_FOR_DELIVERY": 25,
      "DELIVERED": 1480
    }
  }
}
```

---

### **GET /api/admin/users**
List all users with filters.

**Access:** 👑 Admin

**Query Parameters:**
- `role` (optional)
- `search` (optional)
- `page` (optional)
- `limit` (optional)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "phoneNumber": "0812345678",
      "isActive": true,
      "createdAt": "2025-01-01T10:00:00Z",
      "orderCount": 5
    }
  ],
  "pagination": {...}
}
```

---

### **GET /api/admin/vendors/pending**
Get vendors pending approval.

**Access:** 👑 Admin

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "vendor_1",
      "businessName": "New Campus Store",
      "businessAddress": "456 University Ave",
      "businessPhone": "0123456789",
      "status": "PENDING_APPROVAL",
      "user": {
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "createdAt": "2025-01-10T09:00:00Z"
    }
  ]
}
```

---

### **POST /api/admin/vendors/:id/approve**
Approve a vendor application.

**Access:** 👑 Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Vendor approved successfully",
  "data": {
    "id": "vendor_1",
    "status": "APPROVED",
    "approvedAt": "2025-01-15T15:00:00Z"
  }
}
```

---

### **POST /api/admin/vendors/:id/reject**
Reject a vendor application.

**Access:** 👑 Admin

**Request:**
```json
{
  "reason": "Incomplete business information"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Vendor application rejected"
}
```

---

### **GET /api/admin/orders**
Get all platform orders.

**Access:** 👑 Admin

**Query Parameters:**
- `status` (optional)
- `vendorId` (optional)
- `startDate` (optional)
- `endDate` (optional)
- `page` (optional)
- `limit` (optional)

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

---

## 📤 Upload Endpoints

### **POST /api/upload/image**
Upload image to Vercel Blob storage.

**Access:** 🔒 Authenticated

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Constraints:**
- Max size: 5MB
- Allowed types: jpg, jpeg, png, webp

**Response (200):**
```json
{
  "success": true,
  "url": "https://blob.vercel.app/edubaskets/abc123.jpg"
}
```

**Errors:**
- 400: File too large
- 400: Invalid file type
- 401: Unauthorized

---

## 🔔 Notification Endpoints

### **GET /api/notifications**
Get user's notifications.

**Access:** 🔒 Authenticated

**Query Parameters:**
- `unreadOnly` (optional): boolean
- `page` (optional)
- `limit` (optional)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_1",
      "title": "Order Delivered",
      "message": "Your order #ORD-2025-0001 has been delivered!",
      "type": "delivery",
      "data": {
        "orderId": "order_1"
      },
      "isRead": false,
      "createdAt": "2025-01-15T14:25:00Z"
    }
  ],
  "unreadCount": 3
}
```

---

### **PATCH /api/notifications/:id/read**
Mark notification as read.

**Access:** 🔒 Authenticated (own notification)

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## ⚠️ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "field": "email",
      "issue": "Email already exists"
    }
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `VALIDATION_ERROR` (400)
- `SERVER_ERROR` (500)

---

## 🔄 Rate Limiting

**Limits:**
- Public endpoints: 100 requests/minute
- Authenticated: 300 requests/minute
- Payment webhooks: No limit (trusted source)

**Response when limited:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

---

**Document Version:** 1.0  
**Last Updated:** December 27, 2024  
**Status:** APPROVED
