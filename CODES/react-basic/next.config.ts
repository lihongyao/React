import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: 'tailwindui.com' }, { hostname: 'images.unsplash.com' }, { hostname: 'i.imgur.com' }]
  }
};

export default nextConfig;
