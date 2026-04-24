# Feature Summary: Dish Image Uploads

## Intent
Enable restaurant admins to upload high-quality images of their dishes to enhance the customer ordering experience.

## Scope
- Implementation of Cloudflare R2 storage for dish assets.
- Custom worker routing for serving media files.
- Admin UI for file selection and upload.
- Customer UI for displaying dish imagery in "Showcase Mode".

## Strategic Fit
Visuals are critical for high-conversion menus. This feature aligns with our "Apple-Inspired" UI goal by making the menu feel more alive and professional.

## Execution Log
- **Infrastructure**: Modified `src/worker.ts` to serve R2 assets via `/media/*` with edge caching.
- **API**: Implemented `src/app/api/admin/menu/upload/route.ts` using the R2 binding for multi-tenant image storage.
- **Admin UI**: Integrated deferred R2 upload and preview into the "New Dish" workflow in `MenuAdminClient.tsx`. Images are now only uploaded to R2 upon dish creation.
- **Customer UI**: Enabled responsive image display in `CustomerMenuClient.tsx` with Apple-inspired border-radius and object-fit standards.
