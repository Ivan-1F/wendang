'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { create, load, search, type Orama } from '@orama/orama';
import { FileTextIcon, HashIcon, Loader2Icon, SearchIcon } from 'lucide-react';
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { KbdGroup, Kbd } from '@/components/ui/kbd';
import { useSearchModal } from '@/components/search-modal-provider';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  pageTitle: string;
  groupTitle: string;
  content: string;
  path: string;
  locale: string;
}

const searchSchema = {
  id: 'string',
  title: 'string',
  pageTitle: 'string',
  groupTitle: 'string',
  content: 'string',
  path: 'string',
  locale: 'string',
} as const;

// Keyboard shortcut hook
function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === key) {
        event.preventDefault();
        callback();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, callback]);
}

// Highlight matching text
function highlightText(text: string, query: string): ReactNode {
  if (!query.trim() || !text) return text;

  // Split query into words for matching
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return text;

  // Create regex pattern for all words
  const pattern = new RegExp(
    `(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi',
  );

  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const isMatch = words.some((w) => part.toLowerCase() === w.toLowerCase());
    if (isMatch) {
      return (
        <mark key={i} className="bg-transparent text-primary">
          {part}
        </mark>
      );
    }
    return part;
  });
}

// Get content snippet around the matched term
function getContentSnippet(
  content: string,
  query: string,
  maxLength: number = 120,
): string {
  if (!content) return '';

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return content.slice(0, maxLength);

  // Find the first match position
  const lowerContent = content.toLowerCase();
  let matchIndex = -1;

  for (const word of words) {
    const idx = lowerContent.indexOf(word);
    if (idx !== -1 && (matchIndex === -1 || idx < matchIndex)) {
      matchIndex = idx;
    }
  }

  if (matchIndex === -1) {
    // No match found in content, return start
    return (
      content.slice(0, maxLength) + (content.length > maxLength ? '...' : '')
    );
  }

  // Calculate snippet boundaries
  const start = Math.max(0, matchIndex - 30);
  const end = Math.min(content.length, matchIndex + maxLength - 30);

  let snippet = content.slice(start, end);

  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';

  return snippet;
}

// Build breadcrumb based on result type
function getBreadcrumb(result: SearchResult, isSection: boolean): string {
  const parts: string[] = [];

  if (result.groupTitle) {
    parts.push(result.groupTitle);
  }

  parts.push(result.pageTitle);

  if (isSection && result.title !== result.pageTitle) {
    parts.push(result.title);
  }

  return parts.join(' > ');
}

// Search trigger button (full version with text)
export function SearchTrigger({ className }: { className?: string }) {
  const t = useTranslations('search');
  const { setOpen } = useSearchModal();

  return (
    <Button
      variant={'outline'}
      size={'sm'}
      className={cn(
        'cursor-pointer font-normal text-muted-foreground w-80 justify-between hover:bg-muted/20',
        className,
      )}
      onClick={() => setOpen(true)}
    >
      <div className={'flex items-center'}>
        <SearchIcon className={'mr-1'} />
        {t('search_documentation')}
      </div>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </Button>
  );
}

// Search trigger button (icon only version for mobile)
export function SearchTriggerIcon({ className }: { className?: string }) {
  const { setOpen } = useSearchModal();

  return (
    <Button
      variant={'outline'}
      size={'icon'}
      className={cn('cursor-pointer', className)}
      onClick={() => setOpen(true)}
    >
      <SearchIcon className="size-4" />
    </Button>
  );
}

// Search modal component
export function SearchModal() {
  const t = useTranslations('search');

  const router = useRouter();
  const locale = useLocale();
  const { open, setOpen } = useSearchModal();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [db, setDb] = useState<Orama<typeof searchSchema> | null>(null);

  // Load search index
  useEffect(() => {
    if (!open || db) return;

    async function loadIndex() {
      setLoading(true);
      try {
        const response = await fetch('/search-index.json');
        const data = await response.json();
        const database = create({ schema: searchSchema });
        await load(database, data);
        setDb(database);
      } catch (error) {
        console.error('Failed to load search index:', error);
      } finally {
        setLoading(false);
      }
    }

    loadIndex();
  }, [open, db]);

  // Perform search
  useEffect(() => {
    if (!db || !query.trim()) {
      setResults([]);
      return;
    }

    async function performSearch() {
      if (!db) return;

      const searchResults = await search(db, {
        term: query,
        properties: ['title', 'pageTitle', 'content'],
        limit: 10,
        where: {
          locale: locale,
        },
      });

      // If no results for current locale, search all locales
      if (searchResults.hits.length === 0) {
        const allResults = await search(db, {
          term: query,
          properties: ['title', 'pageTitle', 'content'],
          limit: 10,
        });
        setResults(
          allResults.hits.map((hit) => hit.document as unknown as SearchResult),
        );
      } else {
        setResults(
          searchResults.hits.map(
            (hit) => hit.document as unknown as SearchResult,
          ),
        );
      }
    }

    performSearch();
  }, [db, query, locale]);

  // Keyboard shortcut to open search
  useKeyboardShortcut('k', () => setOpen(true));

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  function navigateToResult(result: SearchResult) {
    const localizedPath = `/${locale}${result.path}`;
    router.push(localizedPath);
    setOpen(false);
  }

  // Check if result is a section (has # in path)
  function isSection(result: SearchResult): boolean {
    return result.path.includes('#');
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={t('search_documentation')}
      description="Search for pages and sections in the documentation"
      className="top-[15%] sm:max-w-2xl!"
    >
      <Command shouldFilter={false} className="rounded-lg">
        <CommandInput
          placeholder={t('search_documentation')}
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-80">
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <CommandEmpty>{t('no_results_found')}</CommandEmpty>
          )}

          {!loading && !query && <div className="pb-1" />}

          {results.length > 0 && (
            <CommandGroup heading="Results">
              {results.map((result) => {
                const section = isSection(result);
                const breadcrumb = getBreadcrumb(result, section);
                const snippet = getContentSnippet(result.content, query);

                return (
                  <CommandItem
                    key={result.id}
                    value={result.id}
                    onSelect={() => navigateToResult(result)}
                  >
                    {section ? (
                      <HashIcon className="mt-1 size-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <FileTextIcon className="mt-1 size-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      {/* Line 1: Breadcrumb */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate">{breadcrumb}</span>
                        {result.locale !== locale && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-xs uppercase">
                            {result.locale}
                          </span>
                        )}
                      </div>
                      {/* Line 2: Title */}
                      <div className="font-medium">
                        {highlightText(result.title, query)}
                      </div>
                      {/* Line 3: Content */}
                      {snippet && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {highlightText(snippet, query)}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
