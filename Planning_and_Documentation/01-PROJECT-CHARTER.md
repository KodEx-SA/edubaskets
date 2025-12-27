# eDuBaskets - Project Charter

## 📋 Project Overview

**Project Name:** eDuBaskets  
**Version:** 1.0 (MVP)  
**Project Lead:** Ashley Koketso  
**Start Date:** December 27, 2024  
**Target Launch:** January 30, 2025 (5 weeks)  
**Platform Type:** Progressive Web App (PWA) - Mobile-First Responsive Design

---

## 🎯 Project Vision

Create a student-focused delivery platform that connects university students with local vendors selling essential hampers (food, hygiene, study kits), delivered by local drivers - similar to Uber Eats but specialized for student needs.

---

## 🎨 Brand Identity

**Colors:**
- Primary: Teal (#008080) - Trust, intelligence, growth
- Secondary: Pastel Green (#A3D4A3) - Accents, success states
- Accent: Navy (#101730) - Text, headers

**Typography:** Poppins or Inter (Clean, modern, legible)

**Design Style:** Minimalist, rounded corners (8-12px), youthful, Uber Eats-inspired

---

## 👥 Target Users

1. **Students** - Primary customers ordering hampers
2. **Vendors** - Local businesses creating and selling hampers
3. **Drivers** - Delivery personnel (Phase 1: Admin-managed)
4. **Admins** - Platform administrators

---

## 🚀 MVP Scope (Phase 1)

### ✅ In Scope - Core Features

**Student Experience (Mobile Web):**
- Authentication (Email, Google OAuth, Student ID)
- Browse hampers (list view with filters)
- View hamper details (images, contents, price, vendor info)
- Shopping cart functionality
- Checkout and payment (PayFast integration)
- Order history
- Simple order status tracking (text-based updates)
- User profile management

**Vendor Dashboard (Desktop Web):**
- Vendor authentication
- Create/edit/delete hampers
- Upload hamper images
- Manage hamper contents and pricing
- View incoming orders
- Confirm/prepare orders
- Basic analytics (total orders, revenue, top sellers)
- Profile and business info management

**Admin Panel (Desktop Web):**
- Admin authentication
- Dashboard overview (metrics, active orders)
- User management (students, vendors)
- Vendor approval system
- Order management and monitoring
- Platform analytics
- Manual delivery assignment (interim solution)

**Technical Features:**
- Responsive design (mobile-first)
- Progressive Web App capabilities
- Real-time order status updates (WebSockets)
- Payment gateway integration (PayFast)
- Email notifications (order confirmations, status updates)
- Image upload and optimization
- Secure authentication and authorization

### ❌ Out of Scope - Future Phases

**Phase 2 (Feb-March 2025):**
- Native mobile apps (React Native)
- Real-time map tracking with driver location
- Driver mobile app
- Ratings and reviews system
- Push notifications
- SMS notifications
- Advanced analytics and reporting

**Phase 3 (Future):**
- Multiple payment gateways
- Loyalty and rewards program
- Subscription hampers
- In-app chat/messaging
- Promotional campaigns and discounts
- Vendor-specific apps

---

## 🛠️ Technology Stack

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- React Hook Form + Zod validation

**Backend:**
- Next.js API Routes (Node.js)
- NextAuth.js v5 (Authentication)
- WebSockets (Socket.io or Pusher)

**Database:**
- PostgreSQL (Neon.com - cloud hosted)
- Prisma ORM

**Third-Party Services:**
- Firebase Authentication (Google OAuth, email)
- PayFast (Payment gateway - South African)
- Google Maps API (future phase)
- Cloudinary or Vercel Blob (Image storage)
- Resend or SendGrid (Email notifications)

**Deployment:**
- Vercel (Frontend + API)
- Neon.com (Database)

---

## 📅 Timeline Breakdown

**Week 1 (Dec 27 - Jan 2):**
- Complete project documentation
- Database schema design
- Project setup and configuration
- Authentication implementation

**Week 2 (Jan 3 - Jan 9):**
- Core database models
- Student-facing UI (browse, hamper details)
- Shopping cart functionality
- Vendor dashboard skeleton

**Week 3 (Jan 10 - Jan 16):**
- Checkout and payment integration
- Order management system
- Vendor hamper management
- Admin panel basics

**Week 4 (Jan 17 - Jan 23):**
- Real-time order updates (WebSockets)
- Email notifications
- Admin order management
- Testing and bug fixes

**Week 5 (Jan 24 - Jan 30):**
- Final testing and QA
- Performance optimization
- Security audit
- Deployment and launch preparation

---

## 🎯 Success Metrics (MVP)

**Launch Criteria:**
- 5+ vendor accounts created and approved
- 10+ active hamper listings
- Successful end-to-end transaction flow (order → payment → delivery)
- <3 second page load time
- Mobile responsive on all major devices
- Zero critical security vulnerabilities

**Post-Launch Goals (First Month):**
- 50+ student registrations
- 20+ orders completed
- 90%+ payment success rate
- 4+ star average user satisfaction

---

## 🚨 Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation Strategy |
|------|--------|------------|---------------------|
| Timeline too aggressive | High | Medium | Focus on MVP only, defer Phase 2 features |
| Payment integration delays | High | Medium | Start PayFast integration early, have backup (manual payment) |
| Database performance issues | Medium | Low | Use Neon's pooling, optimize queries from start |
| Vendor onboarding slow | Medium | Medium | Create demo vendors, simple approval process |
| Security vulnerabilities | High | Low | Follow OWASP guidelines, use NextAuth best practices |

---

## 💰 Cost Estimates (Monthly)

**Development Phase:**
- Neon.com (Database): Free tier initially
- Vercel (Hosting): Free tier (upgrade if needed ~$20/month)
- Cloudinary/Vercel Blob: Free tier initially
- Google Maps API: Deferred to Phase 2
- Email service: Free tier (Resend: 3000 emails/month free)

**Estimated Monthly Running Cost (MVP):** R0 - R400 (~$0-25 USD)

---

## 📞 Stakeholders

**Development Team:**
- Ashley Koketso (Full-stack Developer, Project Lead)

**Future Roles:**
- QA Tester (Week 4-5)
- Beta Users (Students, Vendors)

---

## ✅ Approval & Sign-off

**Document Version:** 1.0  
**Created:** December 27, 2024  
**Status:** APPROVED - Ready to proceed to Technical Architecture

---

## 📝 Next Steps

1. ✅ Project Charter (This document)
2. ⏭️ Technical Architecture Document
3. ⏭️ Database Schema Design
4. ⏭️ API Endpoints Documentation
5. ⏭️ User Stories & Features List
6. ⏭️ Development Roadmap (Detailed)
7. ⏭️ Component Structure
8. ⏭️ Authentication Flow Documentation
