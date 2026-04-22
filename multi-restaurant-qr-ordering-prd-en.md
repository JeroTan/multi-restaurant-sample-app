# Product Requirements Document: Multi-Restaurant SaaS QR Ordering Platform

**Version**: 1.0
**Date**: 2026-04-20
**Author**: Sarah (Product Owner)
**Quality Score**: 90/100

---

## Executive Summary

This product is a SaaS multi-tenant QR code ordering platform for the restaurant industry. Each table in a restaurant displays a unique QR code. Customers scan it with their phone and immediately browse the menu, select items, and place orders directly in their mobile browser — no app download required. Staff receive and process orders in real time via a web dashboard, with a "order now, pay later" model that simplifies front-of-house operations.

The platform is built on a SaaS multi-tenant architecture, allowing multiple restaurants to onboard independently with fully isolated data. The platform operator reviews merchant applications, manages subscription plans, and earns recurring subscription revenue. The target is to onboard 10+ restaurants within 3 months of launch to validate the business model.

---

## Problem Statement

**Current Pain Points:**
- Traditional paper menus are expensive to update, prone to damage, and cannot show dish photos or real-time stock status
- Calling staff to take orders is inefficient; missed and incorrect orders are common during peak hours
- Restaurants must invest in costly POS hardware or third-party systems
- Small and medium restaurants lack the technical resources to build their own digital ordering systems

**Proposed Solution:**
Provide an out-of-the-box SaaS QR ordering platform. Restaurants simply print QR codes and place them on tables. Customers scan and order via their phone browser — zero hardware cost, zero app installation barrier.

**Business Impact:**
- Reduce operational errors and improve table turnover efficiency for restaurants
- Provide a sustainable subscription revenue stream for the platform operator
- Platform goal: 10+ restaurants onboarded within 3 months of launch

---

## Success Metrics

**Primary KPIs:**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Onboarded restaurants | ≥ 10 within 3 months of launch | Platform admin dashboard |
| Customer order conversion rate | ≥ 60% of QR scanners successfully submit an order | QR scan events vs. order creation events |
| Order notification latency | < 5 seconds from submission to staff notification | Server-side log monitoring |
| Platform subscription renewal rate | ≥ 80% renewal rate by month 2 | Subscription status tracking |

**Validation:** Conduct the first data review 1 month after launch; track all KPIs on a monthly basis.

---

## User Personas

### Persona 1: Customer (Dana)
- **Role**: Dine-in customer
- **Goals**: Quickly scan the QR code, browse the menu, and place an order without waiting for a server
- **Pain Points**: Doesn't want to install an app; wants a simple flow and clear order status visibility
- **Technical Level**: Basic — comfortable with scanning QR codes but not with complex interfaces

### Persona 2: Staff / Cashier (Lily)
- **Role**: Front-of-house server or cashier
- **Goals**: See new orders in real time, confirm them quickly, and update status to avoid missed orders
- **Pain Points**: Chaotic during peak hours; paper orders are hard to track
- **Technical Level**: Intermediate — comfortable with phone use, needs a clean and intuitive interface

### Persona 3: Restaurant Admin (Tom)
- **Role**: Restaurant owner or operations manager
- **Goals**: Independently maintain the menu (list/delist items, update prices), manage tables and QR codes, and review sales data
- **Pain Points**: Currently relies on technical staff to make menu changes, which is costly and slow
- **Technical Level**: Intermediate — basic computer skills

### Persona 4: Platform Super Admin (Admin)
- **Role**: SaaS platform operations team member
- **Goals**: Review restaurant onboarding applications, manage subscription plans, and monitor platform health
- **Pain Points**: Needs a unified view to oversee all tenants

---

## User Stories & Acceptance Criteria

### Story 1: Customer Scans QR Code to Order

**As a** dine-in customer
**I want to** scan the QR code on my table and complete my order in a mobile browser
**So that** I can choose my dishes and submit an order without waiting for a server

**Acceptance Criteria:**
- [ ] Menu page loads within 3 seconds of scanning the QR code
- [ ] Menu displays category navigation, dish photos, names, prices, and variant options
- [ ] Sold-out items are marked "Sold Out" and cannot be added to cart
- [ ] Cart supports quantity adjustments, item notes, and subtotal display
- [ ] After submission, an order confirmation page shows the order number and estimated wait time
- [ ] Customers at the same table can place additional orders (appended to the same table session)
- [ ] Interface supports multiple languages (at minimum Chinese and English, extensible)

### Story 2: Staff Receives Real-Time Order Notifications

**As a** restaurant staff member
**I want to** receive real-time new order notifications in the web dashboard
**So that** I can confirm and prepare orders promptly without missing any

**Acceptance Criteria:**
- [ ] Staff dashboard shows a notification (audio + visual alert) within 5 seconds of a new order being submitted
- [ ] Order list is sorted by table number and time, and shows full item details
- [ ] Staff can update order status: Pending → Preparing → Served → Completed
- [ ] Customers can view the current status of their order
- [ ] Supports filtering and searching orders by table number

### Story 3: Restaurant Admin Manages Menu

**As a** restaurant admin
**I want to** independently maintain menu content in the backend
**So that** I can update dish information without relying on technical staff

**Acceptance Criteria:**
- [ ] Supports creating, editing, and deleting dish categories
- [ ] Dishes support image upload, name, description, price, and multiple variants (e.g., small/large)
- [ ] Variants support add-on options (e.g., extra spicy, less sugar) with optional surcharges
- [ ] Supports creating combo meals (multiple dishes bundled at a custom price)
- [ ] Dishes can be listed or delisted with one click (sold-out marking)
- [ ] Changes take effect immediately without requiring a republish action

### Story 4: Admin Creates Tables and QR Codes

**As a** restaurant admin
**I want to** create table entries in the system and generate corresponding QR codes
**So that** when customers scan, the system identifies the table number and associates it with their order

**Acceptance Criteria:**
- [ ] Tables can be created in bulk by entering a range of table numbers
- [ ] Each table automatically generates a unique QR code, downloadable as PNG or PDF for printing
- [ ] QR code URL contains the restaurant ID and table number
- [ ] Supports resetting a table's QR code (old code is immediately invalidated)

### Story 5: Platform Super Admin Reviews Restaurant Applications

**As a** platform super admin
**I want to** review restaurant onboarding applications and manage subscription statuses
**So that** the platform can control onboarding quality and maintain subscription revenue

**Acceptance Criteria:**
- [ ] Restaurants can submit an onboarding application (name, address, contact info, business license)
- [ ] Admin can approve or reject applications; approved restaurants gain access to their dashboard
- [ ] Admin can view subscription status and expiry date for all restaurants
- [ ] When a subscription expires, the customer-facing ordering page shows a notice and dashboard features are restricted

---

## Functional Requirements

### Core Features

**Feature 1: Customer Ordering Interface (H5 Web App)**
- Description: Pure web app requiring no installation; compatible with all major mobile browsers
- User flow: Scan QR → Load menu → Browse categories → Add to cart → Add notes → Submit order → View order status
- Edge cases:
  - If the same table already has an active order, prompt the customer to append to it or start a new one
  - Show an error message on network failure to prevent duplicate submissions
  - Display a friendly error page if the QR code is expired or the restaurant is offline
- Multilingual: Customer-facing interface supports Chinese and English via a language toggle; admin dashboard is Chinese-only (MVP)

**Feature 2: Staff Order Management Dashboard**
- Description: Real-time web order board using WebSocket or SSE for order push notifications
- User flow: Log in → View order board → Receive new order alert → Update order status
- Order status flow: `Pending` → `Preparing` → `Served` → `Completed` / `Cancelled`
- Kitchen printing: Print API stub is reserved; browser-based printing from the order detail page is supported in MVP (dedicated printer integration is post-MVP)

**Feature 3: Restaurant Admin Dashboard**
- Menu management: Category management, dish CRUD, image upload (with compression), variant/add-on configuration
- Combo management: Create combo meals, configure included dishes and pricing
- Table management: Create tables, generate/download QR codes, reset QR codes
- Inventory management: Quick toggle for sold-out / back-in-stock status

**Feature 4: Platform Super Admin Dashboard**
- Restaurant onboarding application list with approve/reject actions
- Enrolled restaurant list with basic info and subscription status
- Subscription plan management (plan name, pricing, feature permission configuration)
- Platform overview metrics (total orders, active restaurant count)

### Out of Scope (MVP)
- Online payment integration (WeChat Pay, Alipay, Stripe)
- Restaurant business analytics and reporting
- Customer reviews and ratings
- Loyalty points / membership system
- Automatic kitchen printer integration
- Native mobile app (iOS/Android)
- Delivery / takeout functionality

---

## Technical Constraints

### Architecture
- **Framework**: Next.js 14+ (App Router) — full-stack, unified codebase
- **Real-time notifications**: Server-Sent Events (SSE) or WebSocket for order push
- **Database**: PostgreSQL (recommended); multi-tenancy enforced via Row-Level Security or separate schemas
- **Image storage**: Cloud object storage (AWS S3 or Alibaba Cloud OSS) with image compression
- **Authentication**: NextAuth.js or JWT with role-based access control (RBAC)

### Performance
- Customer menu page first contentful paint < 2 seconds on a 3G connection
- Order submission to staff notification < 5 seconds end-to-end
- Menu images auto-compressed to < 500KB per image

### Security
- **Multi-tenant data isolation**: All database queries must include a `restaurant_id` filter; no cross-tenant data access
- **Order abuse prevention**: Rate limiting — max 10 order submissions per IP per minute (sliding window)
- **QR code integrity**: QR code URLs include an HMAC signature to prevent table number forgery
- **Input validation**: All user inputs validated server-side to prevent XSS and SQL injection
- **HTTPS**: Enforced site-wide

### Internationalization
- Customer-facing pages use `next-intl` or `i18next`; supports Chinese and English
- Admin dashboards are Chinese-only in MVP
- Dish name and description fields support multilingual values (reserved for future extension)

---

## MVP Scope & Phasing

### Phase 1: MVP (Launch Target)

| Module | Priority |
|--------|----------|
| Customer QR scan & order (H5) | P0 |
| Staff real-time order management dashboard | P0 |
| Restaurant menu management dashboard | P0 |
| Table management + QR code generation/download | P0 |
| Platform onboarding review + subscription management | P1 |
| Multilingual customer interface (Chinese/English) | P1 |

**MVP Definition**: The product is shippable when customers can scan and order, staff can receive and manage orders in real time, and restaurant admins can independently maintain menus and tables.

### Phase 2: Enhancements (1–3 months post-MVP)

- **Online payment**: Integrate WeChat Pay / Alipay
- **Restaurant analytics**: Daily/monthly revenue, top-selling dishes, peak-hour analysis
- **Customer review system**: Post-order rating and comment prompts
- **Loyalty points**: Customer phone number registration, point accumulation, and coupon redemption

### Future Considerations
- Kitchen printer auto-push (ESC/POS protocol integration)
- Multi-location support for chain restaurant brands
- Delivery / takeout module
- Dynamic QR table-top advertising carousel

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| Restaurant onboarding pace slower than expected | Medium | High | Offer a 30-day free trial to lower the adoption barrier |
| Multi-tenant data isolation vulnerability | Low | High | Enforce `restaurant_id` filter in all DB queries; conduct security testing before launch |
| Slow load times on low-end mobile devices | Medium | High | SSR for first paint + lazy-load images + menu data caching |
| QR code forgery / order abuse | Low | Medium | HMAC-signed QR code URLs; server-side signature verification |
| Real-time notifications failing on poor connections | Medium | Medium | SSE auto-reconnect + polling fallback mechanism |

---

## Dependencies & Blockers

**Dependencies:**
- Cloud object storage (AWS S3 / Alibaba Cloud OSS): Required for menu image uploads; account must be provisioned before development begins
- Domain + HTTPS certificate: Required for the customer-facing app (camera access for certain QR scan scenarios requires HTTPS)
- QR code generation: `qrcode` npm package; no external service dependency

**Known Blockers:**
- Multilingual copy requires professional translation; if unavailable before MVP launch, machine translation can serve as a temporary placeholder

---

## Appendix

### Glossary
- **Tenant**: A single restaurant enrolled on the platform
- **Table**: A physical table in a restaurant, corresponding to a unique QR code
- **Append Order**: A new order submitted at the same table while a prior order is still active; merged into the same table session
- **Variant**: A size or flavor option for a dish that may affect pricing (e.g., small / large cup)
- **Add-on**: An extra customization option on top of a dish (e.g., extra spicy, no ice)

### References
- UI reference style: Meituan App / Eleme App (mobile ordering flow)
- Technical docs: Next.js App Router — https://nextjs.org/docs
- Internationalization: next-intl — https://next-intl-docs.vercel.app

---

*This PRD was generated through interactive requirements gathering with quality scoring (90/100), covering business, functional, UX, and technical dimensions — ready to hand off to development planning.*
