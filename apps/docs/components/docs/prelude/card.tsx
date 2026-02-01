// Reference: https://www.mintlify.com/docs/components/cards

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import docsConfig from '@/docs.config';
import { renderIcon } from '@/lib/icon';
import type { StringOrElement } from '@/lib/schema';
import { cn } from '@/lib/utils';

export interface CardProps {
  title: string;
  icon?: StringOrElement;
  color?: string;
  href?: string;
  horizontal?: boolean;
  img?: string;
  cta?: string;
  arrow?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function isExternalLink(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://');
}

export function Card({
  title,
  icon,
  color,
  href,
  horizontal = false,
  img,
  cta,
  arrow,
  children,
  className,
}: CardProps) {
  // Determine if arrow should show (default: only for external links)
  const showArrow = arrow ?? (href ? isExternalLink(href) : false);

  // Render icon
  const renderedIcon = icon ? renderIcon(icon, docsConfig) : null;

  const hasIcon = !!renderedIcon;

  const cardContent = (
    <>
      {/* Image at top */}
      {img && !horizontal && (
        <Image
          src={img}
          alt=""
          width={800}
          height={400}
          className="w-full object-cover object-center"
          unoptimized
        />
      )}

      <div
        className={cn(
          'px-6 py-5 relative',
          horizontal && 'flex items-center gap-x-4',
        )}
      >
        {/* Arrow icon for link cards */}
        {showArrow && (
          <div className="absolute top-5 right-5 text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary-light">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        )}

        {/* Icon */}
        {renderedIcon && (
          <div
            className="h-6 w-6 shrink-0 [&>svg]:h-6 [&>svg]:w-6 fill-gray-800 dark:fill-gray-100 text-gray-800 dark:text-gray-100"
            style={color ? { color } : undefined}
          >
            {renderedIcon}
          </div>
        )}

        {/* Content */}
        <div className="w-full">
          <h2
            className={cn(
              'not-prose font-semibold text-base text-gray-800 dark:text-white',
              hasIcon && !horizontal && 'mt-4',
            )}
          >
            {title}
          </h2>

          {children && (
            <div
              className={cn(
                'prose font-normal text-base leading-6 text-gray-600 dark:text-gray-400',
                horizontal ? 'mt-0' : 'mt-1',
              )}
            >
              {children}
            </div>
          )}

          {cta && (
            <div className="mt-8">
              <span className="text-left text-gray-600 dark:text-gray-400 text-sm font-medium flex flex-row items-center gap-2 group-hover:text-primary dark:group-hover:text-primary-light">
                {cta}
                <svg
                  width="3"
                  height="24"
                  viewBox="0 -9 3 24"
                  className="overflow-visible h-6"
                  aria-hidden="true"
                >
                  <path
                    d="M0 0L3 3L0 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const cardClasses = cn(
    'not-prose card block font-normal group relative my-2 ring-2 ring-transparent rounded-2xl',
    'bg-white dark:bg-background border border-gray-950/10 dark:border-white/10 overflow-hidden w-full',
    href &&
      'cursor-pointer hover:!border-primary dark:hover:!border-primary-light',
    className,
  );

  if (href) {
    const isExternal = isExternalLink(href);

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cardClasses}
        >
          {cardContent}
        </a>
      );
    }

    return (
      <Link href={href} className={cardClasses}>
        {cardContent}
      </Link>
    );
  }

  return <div className={cardClasses}>{cardContent}</div>;
}
