import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const items = [
  { label: '简体中文', value: 'cn' },
  { label: 'English', value: 'en' },
];

export const LanguageSelect = () => {
  return (
    <Select items={items} value={'cn'}>
      <SelectTrigger className={'max-w-48 w-full'}>
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
