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
import { useTranslations } from 'next-intl';

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

export const AiActions = ({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
}) => {
  const t = useTranslations('page_actions');

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
        title: t('copy_page.title'),
        description: t('copy_page.description'),
        icon: <CopyIcon />,
        external: false,
        action: copy,
      },
      {
        key: 'view',
        title: t('view_as_markdown.title'),
        description: t('view_as_markdown.description'),
        icon: <SiMarkdown />,
        external: true,
        action: () => window.open(`/docs/${slug.join('/')}.mdx`, '_blank'),
      },
      {
        key: 'chatgpt',
        title: t('open_in_chatgpt.title'),
        description: t('open_in_chatgpt.description'),
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
        title: t('open_in_claude.title'),
        description: t('open_in_claude.description'),
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
        title: t('open_in_perplexity.title'),
        description: t('open_in_perplexity.description'),
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
        title: t('open_in_grok.title'),
        description: t('open_in_grok.description'),
        icon: <SiX />,
        external: true,
        action: () =>
          window.open(
            `https://grok.com/?q=${encodeURIComponent(markdown)}`,
            '_blank',
          ),
      },
    ],
    [copy, markdown, slug, t],
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
    <ButtonGroup className={className}>
      {showCopyButton && (
        <Button variant={'outline'} size={'sm'} onClick={copy}>
          {copied ? (
            <>
              <CheckIcon className={'mr-1'} />
              {t('copied')}
            </>
          ) : (
            <>
              <CopyIcon className={'mr-1'} />
              {t('copy_markdown')}
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
        <DropdownMenuContent className={'w-80'} align={'end'}>
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
