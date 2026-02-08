import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing());

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … static asset extensions in a blacklist (so dotted content routes still pass)
  matcher:
    '/((?!api|trpc|_next|_vercel)(?!.*\\.(?:avif|bmp|css|gif|html|ico|jpe?g|js|json|map|mp4|pdf|png|svg|txt|webmanifest|webp|woff2?|xml|zip)$).*)',
};
