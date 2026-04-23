/** @type {import('next').NextConfig} */
const nextConfig = {
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