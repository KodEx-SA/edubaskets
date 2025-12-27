# eDuBaskets - User Stories & Features

## 📖 Overview

This document details all user stories and features for the eDuBaskets MVP, organized by user role. Each story follows the format: "As a [role], I want to [action], so that [benefit]."

**Priority Levels:**
- 🔴 **P0** - Critical (Must have for MVP)
- 🟡 **P1** - High (Should have for MVP)
- 🟢 **P2** - Medium (Nice to have, defer to Phase 2)

---

## 👨‍🎓 Student User Stories

### Authentication & Account Management

**US-S-001: User Registration** 🔴 P0
- **As a** student
- **I want to** create an account with my email or Google
- **So that** I can order hampers

**Acceptance Criteria:**
- Can register with email and password
- Can register with Google OAuth
- Password must be min 8 characters
- Email verification sent after registration
- Redirected to home page after successful registration

---

**US-S-002: User Login** 🔴 P0
- **As a** student
- **I want to** log in to my account
- **So that** I can access my orders and profile

**Acceptance Criteria:**
- Can log in with email/password
- Can log in with Google
- Session persists for 30 days
- Error message for invalid credentials
- "Remember me" option available

---

**US-S-003: Password Reset** 🟡 P1
- **As a** student
- **I want to** reset my password if I forget it
- **So that** I can regain access to my account

**Acceptance Criteria:**
- "Forgot password" link on login page
- Receive reset link via email
- Link expires after 1 hour
- Can set new password
- Confirmation message after reset

---

**US-S-004: Profile Management** 🟡 P1
- **As a** student
- **I want to** update my profile information
- **So that** my account details are current

**Acceptance Criteria:**
- Can update name, phone number
- Can change password
- Can upload profile picture
- Changes saved immediately
- Success confirmation shown

---

### Browsing & Discovery

**US-S-005: Browse Hampers** 🔴 P0
- **As a** student
- **I want to** see all available hampers
- **So that** I can find what I need

**Acceptance Criteria:**
- See list of hampers with images, names, prices
- See vendor name and rating for each hamper
- Hampers load within 2 seconds
- Mobile-responsive layout
- Shows "Out of stock" for unavailable items

---

**US-S-006: Filter Hampers** 🟡 P1
- **As a** student
- **I want to** filter hampers by category
- **So that** I can find specific types of hampers quickly

**Acceptance Criteria:**
- Filter chips: Food, Hygiene, Study Kits, etc.
- Multiple filters can be applied
- Results update immediately
- Clear all filters option
- Filter count badge shows active filters

---

**US-S-007: Search Hampers** 🟡 P1
- **As a** student
- **I want to** search for hampers by name or description
- **So that** I can find exactly what I'm looking for

**Acceptance Criteria:**
- Search bar at top of page
- Real-time search results
- Searches name, description, and tags
- "No results" message when appropriate
- Search is case-insensitive

---

**US-S-008: View Hamper Details** 🔴 P0
- **As a** student
- **I want to** see detailed information about a hamper
- **So that** I know exactly what's included before ordering

**Acceptance Criteria:**
- View multiple images (swipeable carousel)
- See complete list of items and quantities
- See price, vendor info, rating
- See vendor location and delivery time estimate
- "Add to Cart" button visible

---

**US-S-009: View Vendor Profile** 🟡 P1
- **As a** student
- **I want to** see a vendor's profile and all their hampers
- **So that** I can browse their full offerings

**Acceptance Criteria:**
- Vendor name, logo, description
- Business address and hours
- Overall rating and review count
- List of all vendor's hampers
- "Contact Vendor" option

---

### Shopping Cart & Checkout

**US-S-010: Add to Cart** 🔴 P0
- **As a** student
- **I want to** add hampers to my cart
- **So that** I can order multiple items at once

**Acceptance Criteria:**
- Click "Add to Cart" on hamper detail page
- Can adjust quantity
- Cart badge updates with item count
- Can add multiple hampers from same vendor
- Warning if trying to add from different vendor (single vendor per order in MVP)

---

**US-S-011: View Cart** 🔴 P0
- **As a** student
- **I want to** review my cart before checkout
- **So that** I can verify my order

**Acceptance Criteria:**
- See all items with images, names, quantities
- See subtotal, delivery fee, service fee, total
- Can adjust quantities or remove items
- Cart persists across sessions
- Shows estimated delivery time

---

**US-S-012: Checkout** 🔴 P0
- **As a** student
- **I want to** complete my order with payment
- **So that** I can receive my hampers

**Acceptance Criteria:**
- Enter/confirm delivery address
- See order summary (items, fees, total)
- Option to add driver tip
- Option to add delivery notes
- Redirected to PayFast for payment
- Order created in database with PENDING_PAYMENT status

---

**US-S-013: Payment Processing** 🔴 P0
- **As a** student
- **I want to** pay securely via PayFast
- **So that** my payment information is safe

**Acceptance Criteria:**
- Redirected to PayFast payment page
- Can pay with card, EFT, or instant EFT
- Redirected back after payment
- Order status updates to PAID on success
- Payment failure shows error message

---

### Order Management

**US-S-014: View Order History** 🔴 P0
- **As a** student
- **I want to** see all my past orders
- **So that** I can track my spending and reorder

**Acceptance Criteria:**
- List of all orders (newest first)
- Each order shows: order number, date, vendor, total, status
- Can filter by status (All, Active, Delivered, Cancelled)
- Click to view order details
- Pagination for large order lists

---

**US-S-015: View Order Details** 🔴 P0
- **As a** student
- **I want to** see detailed information about a specific order
- **So that** I can track its progress

**Acceptance Criteria:**
- Order number, date, status
- List of items ordered
- Delivery address
- Payment status and method
- Order timeline/status history
- Estimated delivery time
- Vendor contact information

---

**US-S-016: Track Order Status** 🔴 P0
- **As a** student
- **I want to** see real-time updates on my order status
- **So that** I know when to expect delivery

**Acceptance Criteria:**
- Status timeline shows: Paid → Confirmed → Preparing → Out for Delivery → Delivered
- Each completed step has checkmark and timestamp
- Active step highlighted
- Real-time updates via WebSocket (no page refresh needed)
- Push notification for status changes (Phase 2)

---

**US-S-017: Cancel Order** 🟡 P1
- **As a** student
- **I want to** cancel my order before it's prepared
- **So that** I can change my mind

**Acceptance Criteria:**
- "Cancel Order" button on order detail page
- Can only cancel if status is PAID or CONFIRMED
- Confirmation dialog before cancelling
- Reason for cancellation (optional)
- Refund initiated automatically
- Email confirmation of cancellation

---

**US-S-018: Reorder Previous Order** 🟢 P2
- **As a** student
- **I want to** quickly reorder a previous order
- **So that** I can save time

**Acceptance Criteria:**
- "Reorder" button on past orders
- Items added to cart automatically
- Can review/modify before checkout
- Warning if items no longer available

---

### Notifications

**US-S-019: Receive Email Notifications** 🔴 P0
- **As a** student
- **I want to** receive email updates about my orders
- **So that** I stay informed

**Acceptance Criteria:**
- Order confirmation email after payment
- Status update emails (confirmed, preparing, out for delivery, delivered)
- Cancellation confirmation email
- Professional, branded email templates

---

**US-S-020: In-App Notifications** 🟡 P1
- **As a** student
- **I want to** see notifications within the app
- **So that** I don't miss important updates

**Acceptance Criteria:**
- Notification bell icon with unread count
- Notifications for: order updates, payment confirmation
- Click notification to go to relevant page
- Mark as read functionality
- Delete notification option

---

## 🏪 Vendor User Stories

### Vendor Onboarding

**US-V-001: Vendor Registration** 🔴 P0
- **As a** vendor
- **I want to** register my business on the platform
- **So that** I can sell hampers to students

**Acceptance Criteria:**
- Fill out business information form
- Provide: business name, address, phone, description
- Upload business logo
- Optional: registration number, tax number
- Application status set to PENDING_APPROVAL
- Confirmation message after submission

---

**US-V-002: Vendor Approval Notification** 🔴 P0
- **As a** vendor
- **I want to** be notified when my application is approved or rejected
- **So that** I know when I can start selling

**Acceptance Criteria:**
- Email notification upon approval
- Email notification upon rejection (with reason)
- Approved vendors can access dashboard
- Rejected vendors can reapply with corrections

---

### Dashboard & Analytics

**US-V-003: View Dashboard** 🔴 P0
- **As a** vendor
- **I want to** see an overview of my business metrics
- **So that** I can track my performance

**Acceptance Criteria:**
- Metric cards show: new orders, total revenue, top selling hamper
- Quick access to pending orders
- Recent order activity
- Simple, clean dashboard layout

---

**US-V-004: View Analytics** 🟡 P1
- **As a** vendor
- **I want to** see detailed analytics about my sales
- **So that** I can make informed business decisions

**Acceptance Criteria:**
- Total orders, completed orders, cancelled orders
- Total revenue
- Average rating
- Top selling hampers (with order count and revenue)
- Revenue graph over time (Phase 2)

---

### Hamper Management

**US-V-005: Create Hamper** 🔴 P0
- **As a** vendor
- **I want to** create new hamper listings
- **So that** students can order from me

**Acceptance Criteria:**
- Form with: name, description, category, price
- Upload up to 5 images
- Add items with quantities
- Set stock quantity
- Option to mark as "Sale" with original price
- Tags for search optimization
- Preview before publishing

---

**US-V-006: Edit Hamper** 🔴 P0
- **As a** vendor
- **I want to** update my hamper listings
- **So that** I can keep information current

**Acceptance Criteria:**
- Edit all hamper fields (name, price, stock, etc.)
- Update images
- Add/remove items
- Changes saved immediately
- Existing orders unaffected (they use snapshot data)

---

**US-V-007: Delete Hamper** 🔴 P0
- **As a** vendor
- **I want to** remove hampers I no longer offer
- **So that** students don't order unavailable items

**Acceptance Criteria:**
- "Delete" button on hamper edit page
- Confirmation dialog before deletion
- Soft delete (marked as deleted, not removed from DB)
- No longer appears in student browse view
- Past orders still show hamper details

---

**US-V-008: Manage Stock** 🟡 P1
- **As a** vendor
- **I want to** update stock quantities
- **So that** I don't oversell

**Acceptance Criteria:**
- Quick stock update from hamper list
- Auto-mark as "Out of Stock" when stock = 0
- Manual toggle for availability
- Stock decrements automatically when order is placed

---

### Order Management

**US-V-009: View Incoming Orders** 🔴 P0
- **As a** vendor
- **I want to** see new orders as they come in
- **So that** I can prepare them promptly

**Acceptance Criteria:**
- "New Orders" tab shows orders with PAID status
- Real-time updates via WebSocket
- Audio/visual notification for new order (optional)
- Each order shows: order number, student name, items, total
- "Confirm & Start Preparing" button

---

**US-V-010: Confirm Order** 🔴 P0
- **As a** vendor
- **I want to** confirm that I received an order
- **So that** the student knows I'm preparing it

**Acceptance Criteria:**
- Click "Confirm Order" button
- Order status changes to CONFIRMED
- Student receives notification
- Order moves to "Preparing" queue
- Timestamp recorded

---

**US-V-011: Update Order Status** 🔴 P0
- **As a** vendor
- **I want to** update the order status as I prepare it
- **So that** students can track progress

**Acceptance Criteria:**
- Status progression: CONFIRMED → PREPARING → READY_FOR_PICKUP
- One-click status updates
- Optional note for each status change
- Student notified of each change
- Cannot skip status steps

---

**US-V-012: View Order Details** 🔴 P0
- **As a** vendor
- **I want to** see complete details of an order
- **So that** I can prepare it correctly

**Acceptance Criteria:**
- Full item list with quantities
- Student delivery address
- Delivery notes
- Student contact information
- Payment status
- Order timeline

---

**US-V-013: View Order History** 🟡 P1
- **As a** vendor
- **I want to** see all my past orders
- **So that** I can review my sales history

**Acceptance Criteria:**
- Tabs: New Orders, Completed Orders, All Orders
- Filter by date range
- Search by order number or student name
- Export to CSV (Phase 2)

---

### Profile Management

**US-V-014: Update Business Profile** 🟡 P1
- **As a** vendor
- **I want to** update my business information
- **So that** students have accurate details

**Acceptance Criteria:**
- Edit: business name, address, phone, description
- Update logo
- Update operating hours
- Changes saved immediately
- Visible to students within 1 minute

---

## 👑 Admin User Stories

### Dashboard & Overview

**US-A-001: View Admin Dashboard** 🔴 P0
- **As an** admin
- **I want to** see platform-wide metrics
- **So that** I can monitor the business

**Acceptance Criteria:**
- Metric cards: total orders, revenue, active users
- Orders by status breakdown
- Pending vendor approvals count
- Recent activity feed
- Today's stats (orders, revenue)

---

**US-A-002: View All Orders** 🔴 P0
- **As an** admin
- **I want to** see all orders on the platform
- **So that** I can monitor and resolve issues

**Acceptance Criteria:**
- Searchable, filterable order list
- Filter by: status, vendor, date range
- Each order shows: number, student, vendor, total, status
- Click to view full order details
- Export functionality (Phase 2)

---

### User Management

**US-A-003: View All Users** 🔴 P0
- **As an** admin
- **I want to** see all registered users
- **So that** I can manage the user base

**Acceptance Criteria:**
- List of all users with: name, email, role, join date
- Filter by role (Student, Vendor, Driver, Admin)
- Search by name or email
- User count displayed
- Pagination for large lists

---

**US-A-004: Suspend/Activate User** 🟡 P1
- **As an** admin
- **I want to** suspend or reactivate user accounts
- **So that** I can manage problematic users

**Acceptance Criteria:**
- "Suspend" button on user profile
- Suspended users cannot log in
- "Activate" button to restore access
- Reason for suspension recorded
- Email notification to user

---

### Vendor Management

**US-A-005: View Pending Vendor Approvals** 🔴 P0
- **As an** admin
- **I want to** see all pending vendor applications
- **So that** I can approve legitimate businesses

**Acceptance Criteria:**
- Queue of applications with PENDING_APPROVAL status
- Each shows: business name, applicant name, date submitted
- View full application details
- Approve or Reject actions

---

**US-A-006: Approve Vendor** 🔴 P0
- **As an** admin
- **I want to** approve vendor applications
- **So that** they can start selling

**Acceptance Criteria:**
- "Approve" button on application detail
- Confirmation dialog
- Vendor status changes to APPROVED
- Vendor receives approval email
- Vendor can now access dashboard and create hampers

---

**US-A-007: Reject Vendor** 🔴 P0
- **As an** admin
- **I want to** reject vendor applications with a reason
- **So that** applicants understand why

**Acceptance Criteria:**
- "Reject" button on application detail
- Required: reason for rejection
- Vendor status changes to REJECTED
- Vendor receives rejection email with reason
- Vendor can reapply with corrections

---

**US-A-008: View All Vendors** 🟡 P1
- **As an** admin
- **I want to** see all approved vendors
- **So that** I can monitor vendor activity

**Acceptance Criteria:**
- List of all vendors with: name, approval date, total orders, revenue
- Filter by status (All, Approved, Suspended)
- Search by business name
- Click to view vendor details

---

### Order Management

**US-A-009: Manually Assign Delivery** 🔴 P0
- **As an** admin
- **I want to** assign deliveries to drivers manually
- **So that** orders get delivered (MVP interim solution)

**Acceptance Criteria:**
- View orders with READY_FOR_PICKUP status
- Enter driver name and phone number
- Create delivery assignment
- Order status updates to OUT_FOR_DELIVERY
- Driver details visible to student

---

**US-A-010: Mark Order as Delivered** 🔴 P0
- **As an** admin
- **I want to** mark orders as delivered manually
- **So that** the order lifecycle is complete

**Acceptance Criteria:**
- "Mark as Delivered" button
- Confirmation dialog
- Order status changes to DELIVERED
- Delivery timestamp recorded
- Student receives delivery confirmation

---

**US-A-011: Handle Order Disputes** 🟡 P1
- **As an** admin
- **I want to** manage order disputes and refunds
- **So that** I can resolve customer issues

**Acceptance Criteria:**
- View list of disputed orders
- See dispute reason and messages
- Can refund order
- Can message student or vendor
- Mark dispute as resolved

---

### Platform Settings

**US-A-012: Update Platform Settings** 🟡 P1
- **As an** admin
- **I want to** configure platform-wide settings
- **So that** I can adjust fees and policies

**Acceptance Criteria:**
- Edit: delivery fee, service fee percentage, free delivery threshold
- Settings take effect immediately
- Confirmation after saving
- Audit log of changes (Phase 2)

---

## 🚗 Driver User Stories (Phase 2)

**Note:** Driver functionality is manual/admin-managed in MVP. Full driver app in Phase 2.

---

## 🔄 Epic Summaries

### Epic 1: Student Experience (18 stories)
Enable students to browse, order, and track hamper deliveries.

**Key Features:**
- Account creation and authentication
- Browse and search hampers
- Shopping cart and checkout
- Payment processing
- Order tracking
- Notifications

---

### Epic 2: Vendor Experience (14 stories)
Enable vendors to manage their business and fulfill orders.

**Key Features:**
- Vendor registration and approval
- Dashboard and analytics
- Hamper creation and management
- Order management
- Profile updates

---

### Epic 3: Admin Experience (12 stories)
Enable admins to manage the platform and users.

**Key Features:**
- Platform metrics dashboard
- User management
- Vendor approval process
- Order oversight
- Manual delivery assignment
- Platform settings

---

## ✅ Feature Checklist (MVP)

### Must Have (P0) - 32 features
- [x] User registration & login
- [x] Browse hampers
- [x] View hamper details
- [x] Shopping cart
- [x] Checkout & payment
- [x] Order tracking
- [x] Email notifications
- [x] Vendor registration
- [x] Vendor dashboard
- [x] Create/edit/delete hampers
- [x] Vendor order management
- [x] Admin dashboard
- [x] Vendor approval system
- [x] Manual delivery assignment
- [x] View all users/vendors/orders

### Should Have (P1) - 18 features
- [x] Password reset
- [x] Profile management
- [x] Filter & search hampers
- [x] View vendor profile
- [x] Cancel order
- [x] In-app notifications
- [x] Vendor analytics
- [x] Stock management
- [x] Order history
- [x] User suspension
- [x] Order disputes

### Nice to Have (P2) - 4 features
- [ ] Reorder previous order (Phase 2)
- [ ] Advanced analytics (Phase 2)
- [ ] CSV export (Phase 2)
- [ ] Push notifications (Phase 2)

---

**Document Version:** 1.0  
**Last Updated:** December 27, 2024  
**Status:** APPROVED
