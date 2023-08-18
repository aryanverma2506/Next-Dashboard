/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Add any other domains as needed
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
