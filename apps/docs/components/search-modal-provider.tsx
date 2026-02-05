'use client';

import * as React from 'react';

interface SearchModalContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchModalContext = React.createContext<SearchModalContextValue | null>(
  null,
);

export function SearchModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <SearchModalContext.Provider value={{ open, setOpen }}>
      {children}
    </SearchModalContext.Provider>
  );
}

export function useSearchModal() {
  const context = React.useContext(SearchModalContext);
  if (!context) {
    throw new Error('useSearchModal must be used within a SearchModalProvider');
  }
  return context;
}
