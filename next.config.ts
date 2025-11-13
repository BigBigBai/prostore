import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
  experimental: ({
    outputFileTracingIncludes: {
      '/**/*': [
        './node_modules/.prisma/client/**',
        './node_modules/@prisma/engines/**',
        './lib/generated/prisma/client/**',
      ],
    },
  } as any),
  serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
