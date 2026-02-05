'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface SearchModalContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchModalContext = createContext<SearchModalContextValue | null>(null);

export function SearchModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SearchModalContext.Provider value={{ open, setOpen }}>
      {children}
    </SearchModalContext.Provider>
  );
}

export function useSearchModal() {
  const context = useContext(SearchModalContext);
  if (!context) {
    throw new Error('useSearchModal must be used within a SearchModalProvider');
  }
  return context;
}
