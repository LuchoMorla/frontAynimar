/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  images: {
    domains: ['api.lorem.space', 'placeimg.com', 'i.pinimg.com'],
  }
};

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: true,
  register: true,
  sw: 'service-worker.js'
});

module.exports = withPWA(nextConfig);