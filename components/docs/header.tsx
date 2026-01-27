import Link from 'next/link';
import type { ReactNode } from 'react';
import type { DocsConfig } from '@/lib/config';
import { renderIcon } from '@/lib/icon';
import { cn } from '@/lib/utils';

function NavItem({
  icon,
  title,
  href,
  active,
}: {
  icon?: ReactNode;
  title: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn('relative h-full flex items-center gap-2 [&>svg]:size-4', {
        'text-primary': active,
      })}
    >
      {icon}
      <span className={'text-sm font-medium'}>{title}</span>
      <div
        className={cn('absolute z-10 bottom-0 w-full left-0 h-px', {
          'bg-primary': active,
        })}
      ></div>
    </Link>
  );
}

const NavItems = ({ config }: { config: DocsConfig }) => {
  if (!('groups' in config.group)) {
    return null;
  }

  return (
    <div className={'flex items-center h-10 justify-between'}>
      <div className={'flex items-center h-full gap-6'}>
        {config.group.groups
          .filter((group) => group.align === 'leading')
          .map((group, index) => (
            <NavItem
              key={index}
              title={group.title}
              href={group.link}
              icon={renderIcon(group.icon, config)}
            />
          ))}
      </div>
      <div className={'flex items-center h-full gap-6'}>
        {config.group.groups
          .filter((group) => group.align === 'trailing')
          .map((group, index) => (
            <NavItem
              key={index}
              title={group.title}
              href={group.link}
              icon={renderIcon(group.icon, config)}
            />
          ))}
      </div>
    </div>
  );
};

export function Header({ config }: { config: DocsConfig }) {
  return (
    <nav className={'relative'}>
      <div className={'mx-auto max-w-8xl px-0 lg:px-5'}>
        <div className={'h-14 flex items-center'}>
          <div className={'font-medium'}>{config.title}</div>
        </div>
        <NavItems config={config} />
      </div>
      <div className={'absolute z-0 bottom-0 bg-border w-full h-px'}></div>
    </nav>
  );
}
