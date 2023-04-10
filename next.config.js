/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['api.lorem.space', 'placeimg.com', 'i.pinimg.com', 'https://i.pinimg.com/'],
  }
};

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false,
  register: true,
  sw: 'service-worker.js'
});

module.exports = withPWA(nextConfig);