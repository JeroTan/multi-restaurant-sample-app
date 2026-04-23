const { getPlatformProxy } = require('wrangler');

async function test() {
  const proxy = await getPlatformProxy({ environment: 'development' });
  console.log(proxy.env.DB);
  if (proxy.env.DB) {
    console.log("Binding injected successfully!");
  } else {
    console.log("Binding NOT injected.");
  }
  await proxy.dispose();
}

test();