import { getDb } from '@/db';
import { tenants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import OrdersClient from '@/components/OrdersClient';

export default async function AdminOrdersPage({ params }: { params: { tenantSlug: string } }) {
  const db = getDb();
  const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, params.tenantSlug));
  if (!tenant) return notFound();

  return <OrdersClient tenantId={tenant.id} />;
}
