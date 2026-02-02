'use client';

import { useDocsConfig } from '@/components/docs/config-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter } from '@/i18n/navigation';

export const GroupSelect = () => {
  const router = useRouter();
  const pathname = usePathname();

  const config = useDocsConfig();

  if (!('groups' in config.navigation.group)) {
    return null;
  }

  const groups = config.navigation.group.groups;

  const items = groups.map((group) => ({
    value: group.link,
    label: group.title,
  }));

  // Find the current group based on pathname
  const currentGroup = groups.find((group) => pathname.startsWith(group.link));

  return (
    <Select
      items={items}
      value={currentGroup?.link}
      onValueChange={(value) => {
        if (value) {
          router.push(value);
        }
      }}
    >
      <SelectTrigger className={'w-full'}>
        <SelectValue placeholder="Select a group" />
      </SelectTrigger>
      <SelectContent>
        {groups.map((group) => (
          <SelectItem key={group.link} value={group.link}>
            {group.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
