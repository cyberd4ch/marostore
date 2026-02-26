/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add allowedDevOrigins at the top level
  allowedDevOrigins: ['192.168.0.134'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        port: '',
        pathname: '/img/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        // optionally specify pathname if needed, e.g., '/**' to allow all
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
    // Remove the deprecated domains array
  },
};

module.exports = nextConfig;