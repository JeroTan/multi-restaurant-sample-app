const matchPattern = (pathname, pattern) => {
  // Try URLPattern first if natively available (e.g., in Edge runtime)
  if (typeof URLPattern !== 'undefined') {
    try {
      const urlPattern = new URLPattern({ pathname: pattern });
      return urlPattern.test({ pathname });
    } catch (e) {
      console.log('URLPattern error for', pattern, e.message);
    }
  }

  // Fallback regex matcher for wildcards
  const escaped = pattern
    .split('*')
    .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  
  return new RegExp(`^${escaped}$`).test(pathname);
};

console.log("URLPattern typeof", typeof URLPattern);
console.log("*/menu ->", matchPattern("/demo-restaurant-264/menu", "*/menu"));
console.log("/*/menu ->", matchPattern("/demo-restaurant-264/menu", "/*/menu"));
console.log("/auth/login ->", matchPattern("/auth/login", "/auth/*"));
console.log("/demo-restaurant-264/menu ->", matchPattern("/demo-restaurant-264/menu", "/*"));
