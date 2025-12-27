# eDuBaskets - Development Roadmap

## 🗓️ Timeline Overview

**Project Duration:** 5 weeks (December 27, 2024 - January 30, 2025)  
**Launch Date:** January 30, 2025  
**Development Approach:** Agile, feature-driven

---

## 📅 Week-by-Week Breakdown

```
Week 1: Foundation (Dec 27 - Jan 2)
├── Project setup & configuration
├── Database implementation
└── Authentication system

Week 2: Student Experience (Jan 3 - Jan 9)
├── Browse hampers UI
├── Shopping cart
└── Hamper detail pages

Week 3: Vendor & Orders (Jan 10 - Jan 16)
├── Vendor dashboard
├── Hamper management
└── Order system & payment

Week 4: Real-time & Admin (Jan 17 - Jan 23)
├── WebSocket integration
├── Admin panel
└── Email notifications

Week 5: Polish & Launch (Jan 24 - Jan 30)
├── Testing & bug fixes
├── Performance optimization
└── Deployment & launch
```

---

## 🎯 Week 1: Foundation & Setup
**Dates:** December 27 - January 2, 2025

### Day 1-2: Project Setup (Dec 27-28)

**Tasks:**
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Configure Tailwind CSS v4
- [ ] Install and configure dependencies
- [ ] Set up project structure (folders, naming conventions)
- [ ] Configure ESLint and Prettier
- [ ] Set up Git repository
- [ ] Create .env.example file
- [ ] Set up Vercel project

**Deliverables:**
- Working Next.js app running locally
- Clean, organized project structure
- Git repository with initial commit

**Commands:**
```bash
npx create-next-app@latest edubaskets --typescript --tailwind --app
cd edubaskets
npm install prisma @prisma/client
npm install next-auth@beta
npm install zod react-hook-form @hookform/resolvers
npm install socket.io socket.io-client
npm install lucide-react
npx shadcn-ui@latest init
```

---

### Day 3-4: Database Implementation (Dec 29-30)

**Tasks:**
- [ ] Set up Neon.com PostgreSQL database
- [ ] Create complete Prisma schema (from 03-DATABASE-SCHEMA.md)
- [ ] Run initial migration
- [ ] Create Prisma client singleton
- [ ] Write seed script with demo data
- [ ] Test database connections
- [ ] Set up database connection pooling

**Deliverables:**
- Fully migrated database
- Seed data populated
- Working Prisma queries

**Commands:**
```bash
# Initialize Prisma
npx prisma init

# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

**Seed Data to Create:**
- 1 admin user
- 2-3 vendor users (approved)
- 5-8 student users
- 10-15 hampers across vendors
- Sample orders in various statuses

---

### Day 5-7: Authentication System (Dec 31 - Jan 2)

**Tasks:**
- [ ] Configure NextAuth.js v5
- [ ] Set up email/password authentication
- [ ] Integrate Google OAuth
- [ ] Create login page UI
- [ ] Create registration page UI
- [ ] Implement session management
- [ ] Create protected route middleware
- [ ] Add role-based access control (RBAC)
- [ ] Test authentication flows

**Deliverables:**
- Working login/logout
- Google OAuth integration
- Protected routes
- Role-based access

**Files to Create:**
```
/lib/auth.ts                 # NextAuth config
/middleware.ts               # Route protection
/app/(auth)/login/page.tsx   # Login page
/app/(auth)/register/page.tsx # Register page
/components/auth/           # Auth components
```

**Key Features:**
- Email/password login
- Google OAuth
- Session persistence
- Password hashing (bcrypt)
- JWT tokens

---

## 🛍️ Week 2: Student Experience
**Dates:** January 3-9, 2025

### Day 8-9: Browse Hampers (Jan 3-4)

**Tasks:**
- [ ] Create hampers browse page layout
- [ ] Build HamperCard component
- [ ] Implement hamper list API endpoint
- [ ] Add category filter chips
- [ ] Add search functionality
- [ ] Implement pagination
- [ ] Add loading states
- [ ] Mobile responsive design

**Deliverables:**
- Functional browse page
- Working filters and search
- API endpoint: GET /api/hampers

**Components:**
```
/app/(student)/page.tsx          # Home/Browse page
/components/student/HamperCard   # Hamper card
/components/student/FilterBar    # Filters
/components/student/SearchBar    # Search
/app/api/hampers/route.ts        # Hampers API
```

---

### Day 10-11: Hamper Details & Vendor Pages (Jan 5-6)

**Tasks:**
- [ ] Create hamper detail page
- [ ] Build image carousel component
- [ ] Display hamper items list
- [ ] Show vendor information
- [ ] Create vendor profile page
- [ ] Implement "Add to Cart" functionality
- [ ] API: GET /api/hampers/[id]
- [ ] API: GET /api/vendors/[id]

**Deliverables:**
- Hamper detail page
- Vendor profile page
- Add to cart feature

**Components:**
```
/app/(student)/hampers/[id]/page.tsx
/app/(student)/vendors/[id]/page.tsx
/components/student/ImageCarousel
/components/student/HamperDetails
```

---

### Day 12-14: Shopping Cart & Checkout (Jan 7-9)

**Tasks:**
- [ ] Create cart context/state management
- [ ] Build cart page UI
- [ ] Cart item component (quantity adjust, remove)
- [ ] Create checkout page
- [ ] Delivery address form
- [ ] Order summary component
- [ ] Calculate fees (delivery, service)
- [ ] API: POST /api/orders (create order)
- [ ] Cart persistence (local storage)

**Deliverables:**
- Working shopping cart
- Checkout flow
- Order creation API

**Components:**
```
/context/CartContext.tsx
/app/(student)/cart/page.tsx
/app/(student)/checkout/page.tsx
/components/student/CartItem
/components/student/OrderSummary
/app/api/orders/route.ts
```

**Cart Logic:**
- Add/remove items
- Update quantities
- Calculate totals
- Single vendor per order
- Persist across sessions

---

## 💳 Week 3: Vendor Dashboard & Payment
**Dates:** January 10-16, 2025

### Day 15-16: Vendor Dashboard (Jan 10-11)

**Tasks:**
- [ ] Create vendor dashboard layout
- [ ] Metric cards (orders, revenue, top seller)
- [ ] Recent orders table
- [ ] Vendor navigation sidebar
- [ ] API: GET /api/vendors/[id]/analytics
- [ ] Real-time order count updates

**Deliverables:**
- Vendor dashboard page
- Analytics API

**Components:**
```
/app/(vendor)/dashboard/page.tsx
/components/vendor/MetricCard
/components/vendor/OrdersTable
/components/vendor/Sidebar
```

---

### Day 17-18: Hamper Management (Jan 12-13)

**Tasks:**
- [ ] Create hamper management page
- [ ] Hamper creation form with validation (Zod)
- [ ] Image upload functionality (Vercel Blob)
- [ ] Dynamic hamper items input
- [ ] Edit hamper page
- [ ] Delete hamper (soft delete)
- [ ] Stock management
- [ ] API: POST /api/hampers (create)
- [ ] API: PUT /api/hampers/[id] (update)
- [ ] API: DELETE /api/hampers/[id]

**Deliverables:**
- Complete CRUD for hampers
- Image upload system
- Validation schemas

**Components:**
```
/app/(vendor)/hampers/create/page.tsx
/app/(vendor)/hampers/edit/[id]/page.tsx
/components/vendor/HamperForm
/components/vendor/ImageUploader
/lib/validations/hamper.ts
/app/api/upload/image/route.ts
```

---

### Day 19-21: Payment Integration (Jan 14-16)

**Tasks:**
- [ ] Set up PayFast sandbox account
- [ ] Create payment initiation API
- [ ] Build PayFast redirect logic
- [ ] Implement payment webhook handler
- [ ] Verify PayFast signatures
- [ ] Update order status on payment
- [ ] Create payment success/failure pages
- [ ] Handle payment errors
- [ ] API: POST /api/payments/initiate
- [ ] API: POST /api/payments/verify (webhook)

**Deliverables:**
- Working PayFast integration
- Payment webhook handling
- Order status updates

**Components:**
```
/app/api/payments/initiate/route.ts
/app/api/payments/verify/route.ts
/app/(student)/orders/[id]/payment/success/page.tsx
/app/(student)/orders/[id]/payment/cancel/page.tsx
/lib/payfast.ts
```

**PayFast Flow:**
1. User clicks "Place Order"
2. Order created with PENDING_PAYMENT
3. Redirect to PayFast
4. User completes payment
5. PayFast calls webhook
6. Verify signature
7. Update order to PAID
8. Send confirmation email

---

## 🔄 Week 4: Real-time & Admin Features
**Dates:** January 17-23, 2025

### Day 22-23: WebSocket Integration (Jan 17-18)

**Tasks:**
- [ ] Set up Socket.io server
- [ ] Create WebSocket context
- [ ] Implement room-based messaging
- [ ] Order status update events
- [ ] New order notifications for vendors
- [ ] Real-time order tracking for students
- [ ] Test connection stability
- [ ] Handle reconnection logic

**Deliverables:**
- Working WebSocket server
- Real-time updates

**Files:**
```
/lib/socket-server.ts
/context/WebSocketContext.tsx
/hooks/useWebSocket.ts
```

**Events:**
- `orderCreated` → Notify vendor
- `orderStatusUpdate` → Notify student
- `paymentVerified` → All parties
- `orderCancelled` → Notify vendor & student

---

### Day 24-25: Vendor Order Management (Jan 19-20)

**Tasks:**
- [ ] Create vendor orders page
- [ ] Tabs: New, Preparing, Completed
- [ ] Order detail view
- [ ] Status update buttons (Confirm, Preparing, Ready)
- [ ] Order timeline component
- [ ] API: PATCH /api/orders/[id]/status
- [ ] WebSocket emit on status change

**Deliverables:**
- Vendor order management UI
- Status update functionality

**Components:**
```
/app/(vendor)/orders/page.tsx
/app/(vendor)/orders/[id]/page.tsx
/components/vendor/OrderCard
/components/vendor/OrderTimeline
```

---

### Day 26-27: Admin Panel (Jan 21-22)

**Tasks:**
- [ ] Create admin dashboard
- [ ] Platform metrics cards
- [ ] User management table
- [ ] Vendor approval queue
- [ ] Approve/reject vendor actions
- [ ] Manual delivery assignment
- [ ] Mark order as delivered
- [ ] API: GET /api/admin/dashboard
- [ ] API: GET /api/admin/vendors/pending
- [ ] API: POST /api/admin/vendors/[id]/approve
- [ ] API: POST /api/admin/orders/[id]/assign-delivery

**Deliverables:**
- Admin dashboard
- Vendor approval system
- Manual delivery management

**Components:**
```
/app/(admin)/dashboard/page.tsx
/app/(admin)/users/page.tsx
/app/(admin)/vendors/page.tsx
/components/admin/MetricCard
/components/admin/VendorApprovalCard
/components/admin/DeliveryAssignment
```

---

### Day 28: Email Notifications (Jan 23)

**Tasks:**
- [ ] Set up Resend account
- [ ] Create email templates (React Email)
- [ ] Send order confirmation email
- [ ] Send status update emails
- [ ] Send vendor approval/rejection emails
- [ ] Send payment confirmation
- [ ] Test all email flows
- [ ] Branded email design

**Deliverables:**
- Complete email notification system

**Files:**
```
/lib/email.ts
/emails/OrderConfirmation.tsx
/emails/StatusUpdate.tsx
/emails/VendorApproval.tsx
/emails/PaymentConfirmation.tsx
```

**Emails to Implement:**
1. Welcome email (registration)
2. Order confirmation
3. Payment success
4. Order status updates
5. Vendor approval/rejection
6. Password reset

---

## 🚀 Week 5: Testing, Polish & Launch
**Dates:** January 24-30, 2025

### Day 29-30: Order Tracking & Notifications (Jan 24-25)

**Tasks:**
- [ ] Create order tracking page
- [ ] Status timeline UI component
- [ ] Display driver info (manual assignment)
- [ ] In-app notification system
- [ ] Notification bell component
- [ ] Mark notifications as read
- [ ] API: GET /api/notifications
- [ ] API: PATCH /api/notifications/[id]/read

**Deliverables:**
- Order tracking page
- In-app notifications

**Components:**
```
/app/(student)/orders/[id]/track/page.tsx
/components/student/OrderTimeline
/components/shared/NotificationBell
/components/shared/NotificationItem
```

---

### Day 31-32: UI Polish & Responsive Design (Jan 26-27)

**Tasks:**
- [ ] Review all pages for consistency
- [ ] Ensure mobile responsiveness (all screens)
- [ ] Add loading skeletons
- [ ] Implement error boundaries
- [ ] Add empty states
- [ ] Polish animations and transitions
- [ ] Accessibility improvements (ARIA labels)
- [ ] Test on different devices/browsers
- [ ] Cross-browser compatibility (Chrome, Safari, Firefox)

**Deliverables:**
- Polished, consistent UI
- Fully responsive design
- Better UX

**Focus Areas:**
- Mobile navigation
- Touch-friendly buttons
- Loading states
- Error messages
- Empty states ("No orders yet")
- Skeleton screens

---

### Day 33-34: Testing & Bug Fixes (Jan 28-29)

**Tasks:**
- [ ] End-to-end testing (complete order flow)
- [ ] Test all user roles (student, vendor, admin)
- [ ] Test payment flows (success, failure, cancel)
- [ ] Test WebSocket connections
- [ ] Test email delivery
- [ ] Fix critical bugs
- [ ] Security audit (SQL injection, XSS, CSRF)
- [ ] Performance testing
- [ ] Database query optimization
- [ ] Test error scenarios

**Testing Checklist:**
- [ ] Student can register and login
- [ ] Student can browse and search hampers
- [ ] Student can add to cart and checkout
- [ ] PayFast payment works (sandbox)
- [ ] Order status updates work
- [ ] WebSocket real-time updates work
- [ ] Vendor can create/edit hampers
- [ ] Vendor can manage orders
- [ ] Admin can approve vendors
- [ ] Admin can manage deliveries
- [ ] All emails send correctly
- [ ] Mobile responsive

---

### Day 35: Deployment & Launch (Jan 30)

**Tasks:**
- [ ] Final code review
- [ ] Update environment variables for production
- [ ] Deploy to Vercel (production)
- [ ] Configure custom domain (if available)
- [ ] Run database migrations in production
- [ ] Seed production database with initial data
- [ ] Configure PayFast for production (when ready)
- [ ] Set up error monitoring (Vercel Analytics)
- [ ] Create admin account in production
- [ ] Create 2-3 demo vendor accounts
- [ ] Create 10+ demo hampers
- [ ] Final smoke testing in production
- [ ] Prepare launch announcement

**Deliverables:**
- Live production app
- Initial data seeded
- Launch ready!

**Deployment Checklist:**
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] PayFast configured (sandbox initially)
- [ ] Email service configured
- [ ] Custom domain (optional)
- [ ] SSL certificate active
- [ ] Error monitoring active
- [ ] Analytics tracking
- [ ] Admin access verified

---

## 📊 Daily Workflow

**Morning (9:00 AM - 12:00 PM):**
- Review yesterday's work
- Plan today's tasks (pick 3-4 main tasks)
- Code implementation

**Afternoon (1:00 PM - 5:00 PM):**
- Continue implementation
- Testing
- Documentation (code comments, README updates)

**Evening (6:00 PM - 8:00 PM):**
- Bug fixes
- Code review
- Push to Git
- Update progress tracker

---

## 🎯 Key Milestones

**Week 1 Complete (Jan 2):**
- ✅ Project setup done
- ✅ Database implemented
- ✅ Authentication working

**Week 2 Complete (Jan 9):**
- ✅ Students can browse hampers
- ✅ Shopping cart functional
- ✅ Hamper details page done

**Week 3 Complete (Jan 16):**
- ✅ Vendor dashboard live
- ✅ Hamper management complete
- ✅ Payment integration working

**Week 4 Complete (Jan 23):**
- ✅ Real-time updates functional
- ✅ Admin panel complete
- ✅ Email notifications working

**Week 5 Complete (Jan 30):**
- ✅ All features tested
- ✅ Production deployed
- ✅ Launch ready!

---

## 🚨 Risk Management

### High-Risk Items

**1. PayFast Integration (Week 3)**
- **Risk:** Complex, could take longer than expected
- **Mitigation:** Start early, use sandbox thoroughly, have backup manual payment flow

**2. WebSocket Stability (Week 4)**
- **Risk:** Connection issues, scaling problems
- **Mitigation:** Thorough testing, fallback to polling if needed

**3. Time Constraints (All weeks)**
- **Risk:** Features taking longer than planned
- **Mitigation:** Focus on P0 features first, defer P1/P2 if needed

---

## ✂️ Scope Management

### If Running Behind Schedule:

**Week 2 Cuts:**
- Advanced filters (keep basic category filter)
- Vendor profile page (defer to Phase 2)

**Week 3 Cuts:**
- Vendor analytics (keep basic metrics only)
- Stock auto-decrement (manual updates only)

**Week 4 Cuts:**
- In-app notifications (keep emails only)
- Delivery assignment (super admin can do manually via DB)

---

## 📦 Deliverables Summary

**By January 30, 2025:**

1. **Functional Web App**
   - Student-facing (browse, order, track)
   - Vendor dashboard (manage hampers, orders)
   - Admin panel (approve vendors, manage platform)

2. **Core Features Working:**
   - Authentication (email + Google)
   - Browse and search hampers
   - Shopping cart and checkout
   - PayFast payment integration
   - Order management
   - Real-time order updates (WebSocket)
   - Email notifications

3. **Technical Infrastructure:**
   - Next.js 14 + TypeScript
   - PostgreSQL (Neon)
   - Deployed on Vercel
   - Version controlled (Git)

4. **Documentation:**
   - Code comments
   - README with setup instructions
   - API documentation
   - Deployment guide

---

## 🎓 Learning Resources

**If you get stuck:**

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- NextAuth Docs: https://authjs.dev
- PayFast API Docs: https://developers.payfast.co.za
- Tailwind CSS Docs: https://tailwindcss.com/docs
- Socket.io Docs: https://socket.io/docs

---

## ✅ Success Criteria

**MVP is successful if:**

1. A student can register, browse hampers, add to cart, checkout, and pay successfully
2. Payment flows from student → PayFast → order status update → vendor notification
3. Vendor can create hampers and manage incoming orders
4. Admin can approve vendors and assign deliveries manually
5. Real-time updates work (order status changes reflect immediately)
6. Email notifications send correctly
7. App is mobile-responsive and works on all major browsers
8. No critical bugs or security vulnerabilities
9. Deployed and accessible via public URL

---

**Document Version:** 1.0  
**Last Updated:** December 27, 2024  
**Status:** APPROVED - Ready to Execute!
