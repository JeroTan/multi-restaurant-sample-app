export async function runDailyCleanup(env: any) {
  // Daily cleanup of orphaned soft-deleted dishes
  // Logic: Delete from dishes where is_deleted = 1 AND not in order_items
  try {
    console.log("Running scheduled dish cleanup utility...");
    const result = await env.DB.prepare(
      `DELETE FROM dishes 
       WHERE is_deleted = 1 
       AND id NOT IN (SELECT dish_id FROM order_items)`
    ).run();
    console.log(`Cleanup complete. Rows affected: ${result.meta.changes}`);
  } catch (e) {
    console.error("Scheduled cleanup failed:", e);
    throw e;
  }
}
