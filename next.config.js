/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "https://api.comportarte.com",
      "api.comportarte.com",
    ],
  },
};

module.exports = nextConfig;
