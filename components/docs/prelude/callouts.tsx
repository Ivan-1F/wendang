'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import {
  Info as InfoIcon,
  TriangleAlert,
  CircleAlert,
  Lightbulb,
  CircleCheck,
  OctagonAlert,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const calloutVariants = cva(
  'my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border text-sm prose dark:prose-invert max-w-none [&_code]:text-current [&_a]:text-current [&_strong]:text-current',
  {
    variants: {
      variant: {
        note: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-600/20 dark:text-blue-300',
        warning:
          'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-600/20 dark:text-yellow-300',
        info: 'border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-neutral-700 dark:bg-white/10 dark:text-neutral-300',
        tip: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-600/20 dark:text-green-300',
        check:
          'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-600/20 dark:text-green-300',
        danger:
          'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-600/20 dark:text-red-300',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

const variantIcons: Record<
  NonNullable<VariantProps<typeof calloutVariants>['variant']>,
  LucideIcon
> = {
  note: CircleAlert,
  warning: TriangleAlert,
  info: InfoIcon,
  tip: Lightbulb,
  check: CircleCheck,
  danger: OctagonAlert,
};

interface CalloutProps extends VariantProps<typeof calloutVariants> {
  children: React.ReactNode;
  className?: string;
}

function Callout({ children, className, variant }: CalloutProps) {
  const resolvedVariant = variant || 'info';
  const Icon = variantIcons[resolvedVariant];

  return (
    <div className={cn(calloutVariants({ variant }), className)}>
      <div className="mt-0.5 shrink-0">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 w-full">{children}</div>
    </div>
  );
}

const Note = (props: Omit<CalloutProps, 'variant'>) => (
  <Callout {...props} variant="note" />
);
const Warning = (props: Omit<CalloutProps, 'variant'>) => (
  <Callout {...props} variant="warning" />
);
const Info = (props: Omit<CalloutProps, 'variant'>) => (
  <Callout {...props} variant="info" />
);
const Tip = (props: Omit<CalloutProps, 'variant'>) => (
  <Callout {...props} variant="tip" />
);
const Check = (props: Omit<CalloutProps, 'variant'>) => (
  <Callout {...props} variant="check" />
);
const Danger = (props: Omit<CalloutProps, 'variant'>) => (
  <Callout {...props} variant="danger" />
);

export { Note, Warning, Info, Tip, Check, Danger };
