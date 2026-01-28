import { createContent } from 'fuma-content/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

const withContent = await createContent();

export default withContent(nextConfig);
