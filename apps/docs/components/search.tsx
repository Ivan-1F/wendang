'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { create, load, search, type Orama } from '@orama/orama';
import { FileTextIcon, HashIcon, Loader2Icon } from 'lucide-react';
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

interface SearchResult {
  id: string;
  title: string;
  pageTitle: string;
  content: string;
  path: string;
  locale: string;
}

// Keyboard shortcut hook
function useKeyboardShortcut(key: string, callback: () => void) {
  React.useEffect(() => {
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
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim() || !text) return text;

  // Split query into words for matching
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return text;

  // Create regex pattern for all words
  const pattern = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const isMatch = words.some(w => part.toLowerCase() === w.toLowerCase());
    if (isMatch) {
      return (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 text-inherit rounded-sm px-0.5">
          {part}
        </mark>
      );
    }
    return part;
  });
}

// Get content snippet around the matched term
function getContentSnippet(content: string, query: string, maxLength: number = 120): string {
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
    return content.slice(0, maxLength) + (content.length > maxLength ? '...' : '');
  }

  // Calculate snippet boundaries
  const start = Math.max(0, matchIndex - 30);
  const end = Math.min(content.length, matchIndex + maxLength - 30);

  let snippet = content.slice(start, end);

  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';

  return snippet;
}

export function Search() {
  const router = useRouter();
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [db, setDb] = React.useState<Orama<any> | null>(null);

  // Load search index
  React.useEffect(() => {
    if (!open || db) return;

    async function loadIndex() {
      setLoading(true);
      try {
        const response = await fetch('/search-index.json');
        const data = await response.json();
        const database = create({
          schema: {
            id: 'string',
            title: 'string',
            pageTitle: 'string',
            content: 'string',
            path: 'string',
            locale: 'string',
          },
        });
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
  React.useEffect(() => {
    if (!db || !query.trim()) {
      setResults([]);
      return;
    }

    async function performSearch() {
      const searchResults = await search(db!, {
        term: query,
        properties: ['title', 'pageTitle', 'content'],
        limit: 10,
        where: {
          locale: locale,
        },
      });

      // If no results for current locale, search all locales
      if (searchResults.hits.length === 0) {
        const allResults = await search(db!, {
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
  React.useEffect(() => {
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
    <>
      {/* Search trigger button */}
      <Button variant={'outline'} onClick={() => setOpen(true)}>
        Search Documentation
      </Button>

      {/* Search dialog */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search Documentation"
        description="Search for pages and sections in the documentation"
      >
        <Command shouldFilter={false} className="rounded-lg">
          <CommandInput
            placeholder="Search documentation..."
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
              <CommandEmpty>No results found for "{query}"</CommandEmpty>
            )}

            {!loading && !query && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Type to search...
              </div>
            )}

            {results.length > 0 && (
              <CommandGroup heading="Results">
                {results.map((result) => {
                  const section = isSection(result);
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
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {highlightText(result.title, query)}
                          </span>
                          {result.locale !== locale && (
                            <span className="rounded bg-muted px-1.5 py-0.5 text-xs uppercase">
                              {result.locale}
                            </span>
                          )}
                        </div>
                        {section && result.pageTitle !== result.title && (
                          <div className="text-xs text-muted-foreground">
                            {result.pageTitle}
                          </div>
                        )}
                        {snippet && (
                          <div className="text-sm text-muted-foreground line-clamp-2">
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
    </>
  );
}
