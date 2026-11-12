/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["./prisma/**/*"],
    },
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
