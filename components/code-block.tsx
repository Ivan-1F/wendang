'use client';

import { useState, useRef, type ComponentPropsWithoutRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { renderIcon } from '@/lib/icon';
import docsConfig from '@/docs.config';

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const languageLabels: Record<string, string> = {
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  tsx: 'tsx',
  jsx: 'jsx',
  python: 'python',
  py: 'python',
  go: 'go',
  rust: 'rust',
  bash: 'terminal',
  shell: 'terminal',
  shellscript: 'terminal',
  sh: 'terminal',
  zsh: 'terminal',
  json: 'json',
  css: 'css',
  html: 'html',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  markdown: 'markdown',
  sql: 'sql',
  graphql: 'graphql',
  docker: 'docker',
  dockerfile: 'dockerfile',
  text: 'text',
};

function getLabel(language: string): string {
  return languageLabels[language.toLowerCase()] || language;
}

export function CodeBlock({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'pre'>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const language =
    (props as { 'data-language'?: string })['data-language'] || 'text';
  const title = (props as { 'data-title'?: string })['data-title'];
  const iconName = (props as { 'data-icon'?: string })['data-icon'];
  const hasLineNumbers =
    (props as { 'data-line-numbers'?: string })['data-line-numbers'] === 'true';

  const handleCopy = async () => {
    if (!preRef.current) return;
    const code = preRef.current.textContent || '';
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Display title if provided, otherwise show language label
  const displayLabel = title || getLabel(language);

  // Render icon using config's iconLoader
  const icon = iconName ? renderIcon(iconName, docsConfig) : null;

  return (
    <div
      className={cn(
        'not-prose my-4 rounded-lg relative group',
        'text-gray-950 bg-gray-50 border border-gray-950/10',
        'dark:text-gray-50 dark:bg-white/5 dark:border-white/10',
        hasLineNumbers && 'code-with-line-numbers',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-medium px-3 py-1.5 border-b border-gray-950/5 dark:border-white/5">
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 min-w-0">
          {icon && (
            <span className="[&>svg]:w-3.5 [&>svg]:h-3.5 shrink-0">{icon}</span>
          )}
          <span className="truncate">{displayLabel}</span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="p-1 -mr-1 rounded hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <CopyIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          )}
        </button>
      </div>

      {/* Code area */}
      <div
        className={cn(
          'w-0 min-w-full max-w-full py-3 px-3',
          'text-[13px] leading-relaxed font-mono',
          'overflow-x-auto',
          'scrollbar-thin scrollbar-thumb-rounded',
          'scrollbar-thumb-black/10 hover:scrollbar-thumb-black/15',
          'dark:scrollbar-thumb-white/15 dark:hover:scrollbar-thumb-white/20',
        )}
        style={{ fontVariantLigatures: 'none' }}
      >
        <pre
          ref={preRef}
          className={cn(
            'my-0! bg-transparent! shadow-none! p-0!',
            '[&>code]:bg-transparent [&>code]:p-0',
            '**:ring-0 **:outline-0',
            className,
          )}
          {...props}
        >
          {children}
        </pre>
      </div>
    </div>
  );
}
