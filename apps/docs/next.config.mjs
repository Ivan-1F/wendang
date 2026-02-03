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
      {
        source: '/:locale/docs/:path*.mdx',
        destination: '/:locale/llms.mdx/docs/:path*',
      },
      {
        source: '/:locale/docs/:path*',
        has: [
          {
            type: 'header',
            key: 'accept',
            value: '.*text/markdown.*',
          },
        ],
        destination: '/:locale/llms.mdx/docs/:path*',
      },
      {
        source: '/:locale/docs/:path*',
        has: [
          {
            type: 'header',
            key: 'user-agent',
            value: '.*(claude|anthropic|openai|gpt|cursor|copilot).*',
          },
        ],
        destination: '/:locale/llms.mdx/docs/:path*',
      },
    ];
  },
};

const withContent = await createContent();
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withContent(nextConfig));
