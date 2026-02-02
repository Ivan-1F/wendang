'use client';

import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, CopyIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SiClaude, SiMarkdown } from '@icons-pack/react-simple-icons';
import { OpenAiIcon } from '@/components/icons/openai';

const actions = [
  {
    title: 'Copy page',
    description: 'Copy page as Markdown for LLMs',
    icon: <CopyIcon />,
  },
  {
    title: 'View as Markdown',
    description: 'View this page as plain text',
    icon: <SiMarkdown />,
  },
  {
    title: 'Open in ChatGPT',
    description: 'Ask questions about this page',
    icon: <OpenAiIcon />,
  },
  {
    title: 'Open in Claude',
    description: 'Ask questions about this page',
    icon: <SiClaude />,
  },
];

export const AiActions = () => {
  return (
    <ButtonGroup>
      <Button variant={'outline'} size={'sm'}>
        <CopyIcon className={'mr-1'} />
        Copy Markdown
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant={'outline'} size={'icon-sm'}>
              <ChevronDownIcon
                className={cn(
                  'transition-transform duration-200 data-popup-open:rotate-180',
                )}
              />
            </Button>
          }
        />
        <DropdownMenuContent className={'w-80'}>
          {actions.map((action, index) => (
            <DropdownMenuItem key={index}>
              <div className={'border p-1.5 rounded-md text-muted-foreground'}>
                {action.icon}
              </div>
              <div>
                <div>{action.title}</div>
                <div className={'text-xs text-muted-foreground!'}>
                  {action.description}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
};
