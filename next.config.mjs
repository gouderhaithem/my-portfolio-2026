import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Admin image uploads pass through a Server Action; raise the default
      // 1 MB request-body cap to match the 8 MB limit enforced in
      // media-actions.ts (the file is downscaled to WebP server-side).
      bodySizeLimit: '8mb',
    },
  },
  images: {
    // Allow next/image to optimize Cloudinary-hosted assets.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
