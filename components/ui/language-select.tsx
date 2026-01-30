'use client';

import { useLocale } from 'use-intl';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useConfig } from '@/lib/use-config';

export const LanguageSelect = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const config = useConfig();

  if (!config.i18n) {
    return null;
  }

  const items = Object.entries(config.i18n.locales).map(
    ([value, { label }]) => ({ value, label }),
  );

  return (
    <Select
      items={items}
      value={locale}
      onValueChange={(value) => {
        if (value) {
          router.replace(pathname, { locale: value });
        }
      }}
    >
      <SelectTrigger className={'w-38'}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
