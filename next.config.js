/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    // ponytail: drops IE11 polyfills (transform-classes, Array.flat, etc.) — ~21 KiB savings
    legacyBrowsers: false,
  },
  // Proxy Dropi's WooCommerce OAuth handshake to the Express backend.
  // Dropi hits https://www.aynimar.com/store/wc-auth/v1/authorize — this rewrites
  // that path to the Railway backend which completes the OAuth mock.
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (!backendUrl) return [];
    return [
      {
        source:      '/store/wc-auth/:path*',
        destination: `${backendUrl}/store/wc-auth/:path*`,
      },
    ];
  },
  images: {
    domains: ['api.lorem.space', 'placeimg.com', 'i.pinimg.com', 'https://i.pinimg.com/', 'https://ivrea.com.ar/', 'ivrea.com.ar', 'www.ivrea.com.ar', 'vendingpassec.com', 'picsum.photos', 'localhost', 'drive.google.com', 'firebasestorage.googleapis.com', 'images.unsplash.com', 'd39ru7awumhhs2.cloudfront.net', 'api.dropi.ec', 'api.dropi.co', 'app.dropi.ec'],
  },
  env: {
    NEXT_PUBLIC_API_PAYMENTEZ_API_CODE: process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE,
    NEXT_PUBLIC_API_PAYMENTEZ_API_KEY: process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY,
  }
};

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false,
  register: true,
  sw: 'service-worker.js',
  // ponytail: forces new SW to take over immediately after deploy — prevents stale-cache blank screens
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);