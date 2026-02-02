import type { DocsConfig } from '@/lib/schema';
import { renderIcon } from '@/lib/icon';
import { NavItem } from '@/components/docs/nav-item';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSelect } from '@/components/language-select';
import { cn } from '@/lib/utils';
import { SidebarSheet } from '@/components/docs/sidebar-sheet';

const NavItems = ({
  config,
  className,
}: {
  config: DocsConfig;
  className?: string;
}) => {
  if (!('groups' in config.navigation.group)) {
    return null;
  }

  const groups = config.navigation.group.groups;
  const allLinks = groups.map((g) => g.link);

  return (
    <div className={cn('flex items-center h-10 justify-between', className)}>
      <div className={'flex items-center h-full gap-6'}>
        {groups
          .filter((group) => group.align === 'leading')
          .map((group, index) => (
            <NavItem
              key={index}
              title={group.title}
              href={group.link}
              icon={renderIcon(group.icon, config)}
              allLinks={allLinks}
            />
          ))}
      </div>
      <div className={'flex items-center h-full gap-6'}>
        {groups
          .filter((group) => group.align === 'trailing')
          .map((group, index) => (
            <NavItem
              key={index}
              title={group.title}
              href={group.link}
              icon={renderIcon(group.icon, config)}
              allLinks={allLinks}
            />
          ))}
      </div>
    </div>
  );
};

export function Header({ config }: { config: DocsConfig }) {
  return (
    <nav className={'sticky top-0 bg-background z-20'}>
      {/* px-9 = px-6 (base) + px-3 (sidebar pl-3) */}
      <div className={'px-6 lg:px-9'}>
        <div className={'h-14 flex items-center justify-between'}>
          <div className={'flex items-center'}>
            <div className={'font-medium'}>{config.title}</div>
          </div>
          <div className={'flex items-center space-x-2'}>
            <LanguageSelect />
            <ThemeSwitcher />
            <SidebarSheet config={config} />
          </div>
        </div>
        <NavItems config={config} className={'hidden lg:flex'} />
      </div>
      <div className={'absolute z-0 bottom-0 bg-border w-full h-px'}></div>
    </nav>
  );
}
