import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {

    remotePatterns: [
      {
        protocol: 'http',
        hostname: `192.168.1.216`,
        port: '8080',
        pathname: '/image/**',
      },

    ],
    domains: ["ferf1mheo22r9ira.public.blob.vercel-storage.com"],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://192.168.1.216:8080',
  },
};

export default nextConfig;
