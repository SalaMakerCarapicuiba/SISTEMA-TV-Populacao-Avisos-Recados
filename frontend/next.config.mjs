/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backendsistaticfiles.blob.core.windows.net',
      },
    ],
  },
};

export default nextConfig;
