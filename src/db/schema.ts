import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Tenants (Restaurants)
export const tenants = sqliteTable("tenants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  subscriptionStatus: text("subscription_status", { enum: ["active", "expired"] }).default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Tables
export const tables = sqliteTable("tables", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  tableNumber: text("table_number").notNull(),
  qrCodeSignature: text("qr_code_signature").notNull(),
});

// Categories
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  order: integer("order").default(0),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
});

// Dishes
export const dishes = sqliteTable("dishes", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  categoryId: text("category_id").references(() => categories.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  imageUrl: text("image_url"),
  isSoldOut: integer("is_sold_out", { mode: "boolean" }).default(false),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
});

// Orders
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  tableId: text("table_id").references(() => tables.id).notNull(),
  status: text("status", { enum: ["pending", "preparing", "served", "completed", "cancelled"] }).default("pending"),
  totalPrice: real("total_price").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Order Items
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").references(() => orders.id).notNull(),
  dishId: text("dish_id").references(() => dishes.id).notNull(),
  quantity: integer("quantity").notNull(),
  priceAtTime: real("price_at_time").notNull(),
  notes: text("notes"),
});
