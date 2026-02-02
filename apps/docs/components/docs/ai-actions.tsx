'use client';

import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowUpRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SiClaude, SiMarkdown } from '@icons-pack/react-simple-icons';
import { OpenAiIcon } from '@/components/icons/openai';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export const AiActions = ({ markdown }: { markdown: string }) => {
  const { slug = [] } = useParams<{ slug?: string[] }>();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    setCopied(true);
    void navigator.clipboard.writeText(markdown);
    setTimeout(() => setCopied(false), 1000);
  };

  const actions = [
    {
      title: 'Copy page',
      description: 'Copy page as Markdown for LLMs',
      icon: <CopyIcon />,
      external: false,
      action: copy,
    },
    {
      title: 'View as Markdown',
      description: 'View this page as plain text',
      icon: <SiMarkdown />,
      external: true,
      action: () => window.open(`/docs/${slug.join('/')}.mdx`, '_blank'),
    },
    {
      title: 'Open in ChatGPT',
      description: 'Ask questions about this page',
      icon: <OpenAiIcon />,
      external: true,
      action: () =>
        window.open(
          `https://chatgpt.com/?q=${encodeURIComponent(markdown)}`,
          '_blank',
        ),
    },
    {
      title: 'Open in Claude',
      description: 'Ask questions about this page',
      icon: <SiClaude />,
      external: true,
      action: () =>
        window.open(
          `https://claude.ai/new?q=${encodeURIComponent(markdown)}`,
          '_blank',
        ),
    },
  ];

  return (
    <ButtonGroup>
      <Button variant={'outline'} size={'sm'} onClick={copy}>
        {copied ? (
          <>
            <CheckIcon className={'mr-1'} />
            Copied
          </>
        ) : (
          <>
            <CopyIcon className={'mr-1'} />
            Copy Markdown
          </>
        )}
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
            <DropdownMenuItem key={index} onClick={() => action.action?.()}>
              <div className={'border p-1.5 rounded-md text-muted-foreground'}>
                {action.icon}
              </div>
              <div>
                <div>{action.title}</div>
                <div className={'text-xs text-muted-foreground!'}>
                  {action.description}
                </div>
              </div>
              {action.external && (
                <ArrowUpRightIcon className={'ml-auto text-muted-foreground'} />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
};
