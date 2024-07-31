import nextTranslate from "next-translate-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    testProxy: true,
  },
};

export default nextTranslate(nextConfig);
