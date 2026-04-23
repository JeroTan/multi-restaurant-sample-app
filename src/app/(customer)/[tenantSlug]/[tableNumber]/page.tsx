import { getDb } from '@/db';
import { tenants, tables, categories, dishes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import CustomerMenuClient from '@/components/CustomerMenuClient';

export default async function CustomerPage({
  params,
  searchParams,
}: {
  params: { tenantSlug: string; tableNumber: string };
  searchParams: { sig?: string };
}) {
  const db = getDb();
  
  // 1. Resolve Tenant
  const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, params.tenantSlug));
  if (!tenant) return notFound();

  // 2. Resolve Table
  const [table] = await db.select().from(tables).where(
    and(
      eq(tables.tenantId, tenant.id),
      eq(tables.tableNumber, params.tableNumber)
    )
  );
  if (!table) return notFound();

  // 3. Validate Signature (Optional here, but strictly enforced on POST order)
  const signature = searchParams.sig;

  // 4. Fetch Menu
  const cats = await db.select().from(categories).where(eq(categories.tenantId, tenant.id));
  const items = await db.select().from(dishes).where(eq(dishes.tenantId, tenant.id));

  return (
    <CustomerMenuClient 
      tenant={tenant}
      table={table}
      signature={signature || ''}
      categories={cats}
      dishes={items}
    />
  );
}
