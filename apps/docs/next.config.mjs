import { createContent } from 'fuma-content/next';
import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/docs/:path*',
      },
    ];
  },
};

const withContent = await createContent();
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withContent(nextConfig));
