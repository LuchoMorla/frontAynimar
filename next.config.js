/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['api.lorem.space', 'placeimg.com', 'i.pinimg.com', 'https://i.pinimg.com/', 'https://ivrea.com.ar/', 'ivrea.com.ar', 'www.ivrea.com.ar', 'vendingpassec.com'],
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
  sw: 'sw.js'
});

module.exports = withPWA(nextConfig);