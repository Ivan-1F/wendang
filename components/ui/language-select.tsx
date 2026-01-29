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

const items = [
  { label: '简体中文', value: 'cn' },
  { label: 'English', value: 'en' },
];

export const LanguageSelect = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

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
