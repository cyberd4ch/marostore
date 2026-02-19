/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        port: '',
        pathname: '/img/**', // allows all images under /img/
        search: '', // no specific query params required
      },
    ],
    domains: ['i.ibb.co']
  },
};

module.exports = nextConfig;