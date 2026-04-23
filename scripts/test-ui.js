const baseUrl = 'http://127.0.0.1:8787';

async function main() {
  console.log('--- Starting UI Endpoint Tests ---\n');

  // 1. Create Tenant
  console.log('1. Creating Tenant to test with...');
  const tenantRes = await fetch(`${baseUrl}/api/admin/tenants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'UI Test Restaurant', slug: `ui-test-${Date.now()}` })
  });
  const tenant = await tenantRes.json();
  if (!tenant.slug) {
    console.error('Failed to create tenant:', tenant);
    process.exit(1);
  }
  const slug = tenant.slug;
  const tenantId = tenant.id;
  console.log('✅ Tenant Created:', slug);

  // 2. Create Table
  console.log('\n2. Creating Table...');
  const tableRes = await fetch(`${baseUrl}/api/admin/tables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId, tableNumbers: ["1"] })
  });
  const tables = await tableRes.json();
  if (!tables[0]?.tableNumber) {
    console.error('Failed to create tables:', tables);
    process.exit(1);
  }
  const tableNumber = tables[0].tableNumber;
  const signature = tables[0].qrCodeSignature;
  console.log(`✅ Table Created. Using Table ${tableNumber}`);

  // 3. Test Customer UI
  console.log('\n3. Testing Customer UI Page...');
  const customerUrl = `${baseUrl}/${slug}/${tableNumber}?sig=${signature}`;
  const customerRes = await fetch(customerUrl);
  if (customerRes.status !== 200) {
    console.error('Customer UI failed. Status:', customerRes.status);
    console.error(await customerRes.text());
    process.exit(1);
  }
  const customerHtml = await customerRes.text();
  if (!customerHtml.includes('UI Test Restaurant')) {
    console.error('Customer UI does not contain restaurant name.');
    process.exit(1);
  }
  console.log('✅ Customer UI Page loaded successfully (HTTP 200).');

  // 4. Test Admin Menu UI
  console.log('\n4. Testing Admin Menu Page...');
  const adminMenuUrl = `${baseUrl}/${slug}/menu`;
  const adminMenuRes = await fetch(adminMenuUrl);
  if (adminMenuRes.status !== 200) {
    console.error('Admin Menu UI failed. Status:', adminMenuRes.status);
    console.error(await adminMenuRes.text());
    process.exit(1);
  }
  const adminMenuHtml = await adminMenuRes.text();
  if (!adminMenuHtml.includes('Menu Management')) {
    console.error('Admin Menu UI does not contain correct content.');
    process.exit(1);
  }
  console.log('✅ Admin Menu UI Page loaded successfully (HTTP 200).');

  // 5. Test Admin Orders UI
  console.log('\n5. Testing Admin Orders Page...');
  const adminOrdersUrl = `${baseUrl}/${slug}/orders`;
  const adminOrdersRes = await fetch(adminOrdersUrl);
  if (adminOrdersRes.status !== 200) {
    console.error('Admin Orders UI failed. Status:', adminOrdersRes.status);
    console.error(await adminOrdersRes.text());
    process.exit(1);
  }
  const adminOrdersHtml = await adminOrdersRes.text();
  if (!adminOrdersHtml.includes('Live Orders')) {
    console.error('Admin Orders UI does not contain correct content.');
    process.exit(1);
  }
  console.log('✅ Admin Orders UI Page loaded successfully (HTTP 200).');

  console.log('\n🎉 ALL UI ENDPOINTS RESPONDED SUCCESSFULLY! 🎉');
}

main().catch(console.error);