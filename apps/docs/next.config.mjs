import { createContent } from 'fuma-content/next';
import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

const withContent = await createContent();
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withContent(nextConfig));
