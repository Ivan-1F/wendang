'use client';

import { useLocale } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useDocsConfig } from '@/components/docs/config-context';

export const LanguageSelect = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const config = useDocsConfig();

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
      <SelectTrigger className={'w-38'} size={'sm'}>
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
