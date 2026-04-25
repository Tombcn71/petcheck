import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  experimental: {
    // @ts-ignore - Dit lost de Turbopack error in Vercel op zonder TS fouten
    turbopack: {},
  },
};

module.exports = withPWA(nextConfig);
