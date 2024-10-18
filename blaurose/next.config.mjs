/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '',
      },
    ],
  },
  eslint: { // eslintのlint checkをbuild時にoff
    ignoreDuringBuilds: true,
  },
  typescript: { // type checkをbuild時にoff
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
