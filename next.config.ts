import type { NextConfig } from "next";

// @ts-ignore - Ignore type warnings if allowedDevOrigins isn't recognized by the standard NextConfig interface
const nextConfig: NextConfig = {
  output: 'standalone',
  
  // Trusted development array
  allowedDevOrigins: ['192.168.0.134', '172.20.10.4', 'localhost:3000'],
  
  trailingSlash: false,

  // FIX: Provide only known type configuration variables
  devIndicators: {
    position: 'bottom-right', 
  },

  // 👇 SECURE REVERSE PROXY CONFIGURATION 👇
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'}/api/:path*`, 
      },
    ];
  },



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
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', 
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
