import { getDb } from '@/db';
import { tenants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import MenuAdminClient from '@/components/MenuAdminClient';

export default async function AdminMenuPage(props: { params: Promise<{ tenantSlug: string }> }) {
  const params = await props.params;
  const db = getDb();
  const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, params.tenantSlug));
  if (!tenant) return notFound();

  return <MenuAdminClient tenantId={tenant.id} />;
}
