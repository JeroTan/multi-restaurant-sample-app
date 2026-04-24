# Technical Roadmap: Dish Image Uploads

## I. Architectural Alignment
- **Storage Pillar**: Utilizes Cloudflare R2 (`ORDERING_SYSTEM_BUCKET`) for cost-effective, edge-native asset storage.
- **Worker Pillar**: Extends the custom `src/worker.ts` to serve media files directly from R2, bypassing Next.js overhead for static assets.
- **UI Pillar**: Adheres to the Apple-inspired design in `MenuAdminClient.tsx` by adding a precision-styled file upload field.

## II. Data Model & Schema Changes
- **Dishes Table**: No schema changes needed (the `imageUrl` field is already present).
- **API Contract**:
  - `POST /api/admin/menu/upload`: New endpoint for handling `multipart/form-data` uploads to R2. Returns the relative media path (e.g., `/media/dish-id.png`).

## III. Atomic Task List

### Infrastructure & Backend
- [x] **Task 0: Update Environment Types**
    > **Detailed Summary:** Run `npx wrangler types` to sync the `ORDERING_SYSTEM_BUCKET` binding into `worker-configuration.d.ts`.

- [x] **Task 1: Media Serving Interceptor**
    > **Detailed Summary:** Modify `src/worker.ts` to intercept `GET` requests starting with `/media/`. Retrieve the object from `env.ORDERING_SYSTEM_BUCKET` and return it with appropriate `Content-Type` headers. Support caching via `Cache-Control`.

- [x] **Task 2: Admin Upload API**
    > **Detailed Summary:** Create `src/app/api/admin/menu/upload/route.ts`. Implement logic to parse `FormData`, generate a unique filename based on tenant and timestamp, and store the buffer into `ORDERING_SYSTEM_BUCKET` via the R2 binding (accessed via `process.env`).

### Frontend Implementation
- [x] **Task 3: Admin UI Image Upload Integration**
    > **Detailed Summary:** Update `MenuAdminClient.tsx`. Add a styled file input to the "New Dish" form. Implement an `onUpload` handler that calls the new upload API. Display a small preview thumbnail during the creation phase.

- [x] **Task 4: Customer UI "Showcase" Imagery**
    > **Detailed Summary:** Update `CustomerMenuClient.tsx`. Add an image container to dish cards with an 18px radius (`rounded-lg`). Use `object-cover` and ensure a consistent aspect ratio. Implement a fallback to a `Pale Apple Gray` background for dishes without images.

## IV. Critical Path & Dependencies
1. **Task 1 & 2** are strict blockers for all UI-related image functionality.
2. **Task 3** is required to populate the data for **Task 4**.

## V. Verification & Testing Mechanism (MANDATORY)

| Requirement | Verification Method | Pass Criteria |
| :--- | :--- | :--- |
| **R2 Storage** | Manual Upload | File exists in R2 bucket after admin upload. |
| **Media Serving** | Browser Request | Navigating to `/media/[filename]` displays the image. |
| **Optionality** | UI Check | Dishes without images display a clean placeholder or no image space. |
| **Edge Compatibility**| Build Command | `npm run build` succeeds (verifying R2 binding usage). |
