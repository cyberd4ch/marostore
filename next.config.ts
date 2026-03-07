import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Allows you to test the admin dashboard on your local network
  allowedDevOrigins: ['192.168.0.134'],
  trailingSlash: false,

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
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Added to ensure Cloudinary images load correctly
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // Added this for your new preset avatars
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;