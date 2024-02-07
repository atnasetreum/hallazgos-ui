/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "api.comportarte.com"],
  },
};

module.exports = nextConfig;
