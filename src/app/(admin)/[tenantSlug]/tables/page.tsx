import { getDb } from '@/db';
import { tenants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import TablesAdminClient from '@/components/TablesAdminClient';

export default async function AdminTablesPage({ params }: { params: { tenantSlug: string } }) {
  const db = getDb();
  const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, params.tenantSlug));
  if (!tenant) return notFound();

  return <TablesAdminClient tenant={tenant} />;
}
