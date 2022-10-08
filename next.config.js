/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["wortl.mypinata.cloud"],
  },
};

module.exports = nextConfig;
