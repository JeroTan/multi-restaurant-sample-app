const baseUrl = 'http://127.0.0.1:8787/api';

async function main() {
  console.log('--- Starting API Tests ---\n');

  // 1. Create Tenant
  console.log('1. Creating Tenant...');
  const tenantRes = await fetch(`${baseUrl}/admin/tenants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Restaurant', slug: 'test-restaurant-01' })
  });
  const tenant = await tenantRes.json();
  if (!tenant.id) {
    console.error('Failed to create tenant:', tenant);
    process.exit(1);
  }
  const tenantId = tenant.id;
  console.log('✅ Tenant Created:', tenantId);

  // 2. Create Table
  console.log('\n2. Creating Table...');
  const tableRes = await fetch(`${baseUrl}/admin/tables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId, tableNumbers: ["12", "14"] })
  });
  const tables = await tableRes.json();
  if (!tables[0]?.id) {
    console.error('Failed to create tables:', tables);
    process.exit(1);
  }
  const tableId = tables[0].id;
  const tableNumber = tables[0].tableNumber;
  const signature = tables[0].qrCodeSignature;
  console.log(`✅ Tables Created. Using Table ${tableNumber} (ID: ${tableId})`);

  // 3. Create Category
  console.log('\n3. Creating Category...');
  const catRes = await fetch(`${baseUrl}/admin/menu/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId, name: "Mains", order: 1 })
  });
  const category = await catRes.json();
  if (!category.id) {
    console.error('Failed to create category:', category);
    process.exit(1);
  }
  const categoryId = category.id;
  console.log('✅ Category Created:', categoryId);

  // 4. Create Dish
  console.log('\n4. Creating Dish...');
  const dishRes = await fetch(`${baseUrl}/admin/menu/dishes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenantId,
      categoryId,
      name: "Burger",
      description: "Tasty burger",
      price: 12.99,
      imageUrl: ""
    })
  });
  const dish = await dishRes.json();
  if (!dish.id) {
    console.error('Failed to create dish:', dish);
    process.exit(1);
  }
  const dishId = dish.id;
  console.log('✅ Dish Created:', dishId);

  // 5. Customer Gets Menu
  console.log('\n5. Fetching Menu for Customer...');
  const menuRes = await fetch(`${baseUrl}/customer/menu?tenantId=${tenantId}`);
  const menu = await menuRes.json();
  if (!menu.categories || !menu.dishes) {
    console.error('Failed to get menu:', menu);
    process.exit(1);
  }
  console.log('✅ Menu Fetched. Categories:', menu.categories.length, 'Dishes:', menu.dishes.length);

  // 6. Submit Order (Valid Signature)
  console.log('\n6. Submitting Order...');
  const orderRes = await fetch(`${baseUrl}/customer/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenantId,
      tableId,
      tableNumber,
      signature,
      totalPrice: 12.99,
      items: [
        {
          dishId,
          quantity: 1,
          price: 12.99,
          notes: "No onions"
        }
      ]
    })
  });
  const orderResult = await orderRes.json();
  if (!orderResult.order?.id) {
    console.error('Failed to submit order:', orderResult);
    process.exit(1);
  }
  const orderId = orderResult.order.id;
  console.log('✅ Order Submitted. ID:', orderId);

  // 7. Staff Gets Orders
  console.log('\n7. Fetching Orders for Staff...');
  const staffOrdersRes = await fetch(`${baseUrl}/admin/orders?tenantId=${tenantId}`);
  const staffOrders = await staffOrdersRes.json();
  if (!Array.isArray(staffOrders) || staffOrders.length === 0) {
    console.error('Failed to get staff orders:', staffOrders);
    process.exit(1);
  }
  console.log('✅ Staff Orders Fetched. Total:', staffOrders.length);

  // 8. Staff Updates Order Status
  console.log('\n8. Updating Order Status...');
  const updateRes = await fetch(`${baseUrl}/admin/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId, status: "preparing" })
  });
  const updatedOrder = await updateRes.json();
  if (updatedOrder.status !== "preparing") {
    console.error('Failed to update order status:', updatedOrder);
    process.exit(1);
  }
  console.log('✅ Order Status Updated to:', updatedOrder.status);

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');
}

main().catch(console.error);