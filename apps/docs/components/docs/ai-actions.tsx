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
import {
  SiClaude,
  SiMarkdown,
  SiPerplexity,
  SiX,
} from '@icons-pack/react-simple-icons';
import { OpenAiIcon } from '@/components/icons/openai';
import { useState, useMemo, useCallback, type ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { useDocsConfig } from '@/components/docs/config-context';

type ActionType =
  | 'copy'
  | 'view'
  | 'chatgpt'
  | 'claude'
  | 'perplexity'
  | 'grok';

interface ActionItem {
  key: ActionType;
  title: string;
  description: string;
  icon: ReactNode;
  external: boolean;
  action: () => void;
}

export const AiActions = ({ markdown }: { markdown: string }) => {
  const { slug = [] } = useParams<{ slug?: string[] }>();
  const [copied, setCopied] = useState(false);
  const config = useDocsConfig();

  const { enabled, actions: enabledActions } = config.pageAction;

  const copy = useCallback(() => {
    setCopied(true);
    void navigator.clipboard.writeText(markdown);
    setTimeout(() => setCopied(false), 1000);
  }, [markdown]);

  const allActions: ActionItem[] = useMemo(
    () => [
      {
        key: 'copy',
        title: 'Copy page',
        description: 'Copy page as Markdown for LLMs',
        icon: <CopyIcon />,
        external: false,
        action: copy,
      },
      {
        key: 'view',
        title: 'View as Markdown',
        description: 'View this page as plain text',
        icon: <SiMarkdown />,
        external: true,
        action: () => window.open(`/docs/${slug.join('/')}.mdx`, '_blank'),
      },
      {
        key: 'chatgpt',
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
        key: 'claude',
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
      {
        key: 'perplexity',
        title: 'Open in Perplexity',
        description: 'Research this page with AI',
        icon: <SiPerplexity />,
        external: true,
        action: () =>
          window.open(
            `https://www.perplexity.ai/?q=${encodeURIComponent(markdown)}`,
            '_blank',
          ),
      },
      {
        key: 'grok',
        title: 'Open in Grok',
        description: 'Ask questions about this page',
        icon: <SiX />,
        external: true,
        action: () =>
          window.open(
            `https://grok.com/?q=${encodeURIComponent(markdown)}`,
            '_blank',
          ),
      },
    ],
    [copy, markdown, slug],
  );

  // Filter and sort actions based on config order
  const actions = useMemo(() => {
    return enabledActions
      .map((key) => allActions.find((a) => a.key === key))
      .filter((a) => a !== undefined);
  }, [enabledActions, allActions]);

  const showCopyButton = enabledActions.includes('copy');

  if (!enabled || actions.length === 0) {
    return null;
  }

  return (
    <ButtonGroup>
      {showCopyButton && (
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
      )}
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
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.key}
              onClick={() => action.action?.()}
            >
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
