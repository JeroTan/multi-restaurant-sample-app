import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 14400, // Align with Next 16 4h default
    dangerouslyAllowLocalIP: true, // Allow local development
  },
  webpack: (config) => {
    config.externals.push(function ({ context, request }, callback) {
      if (request === 'cloudflare:workers') {
        return callback(null, 'module cloudflare:workers');
      }
      callback();
    });
    return config;
  },
};

export default nextConfig;