import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface HighlightWordContextValue {
  highlightWord: string | null;
  setHighlightWord: (word: string | null) => void;
  toggleHighlight: (word: string) => void;
}

const HighlightWordContext = createContext<HighlightWordContextValue | null>(null);

export const HighlightWordProvider = ({ children }: { children: ReactNode }) => {
  const [highlightWord, setHighlightWord] = useState<string | null>(null);

  const toggleHighlight = useCallback((word: string) => {
    setHighlightWord((prev) => (prev?.toLowerCase() === word.toLowerCase() ? null : word));
  }, []);

  return (
    <HighlightWordContext.Provider value={{ highlightWord, setHighlightWord, toggleHighlight }}>
      {children}
    </HighlightWordContext.Provider>
  );
};

export const useHighlightWord = () => {
  const ctx = useContext(HighlightWordContext);
  if (!ctx) {
    return { highlightWord: null, setHighlightWord: () => {}, toggleHighlight: () => {} };
  }
  return ctx;
};

/** Normalize a word for matching (strip punctuation, lowercase) */
export const normalizeWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9'-]/g, "");
