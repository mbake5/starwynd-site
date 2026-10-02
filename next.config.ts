import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The redesign preview became the home page.
  async redirects() {
    return [{ source: "/redesign", destination: "/", permanent: false }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
};

export default nextConfig;