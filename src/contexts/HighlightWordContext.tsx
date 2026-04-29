import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { VocabWord } from "@/types/lesson";

interface HighlightWordContextValue {
  highlightWord: string | null;
  setHighlightWord: (word: string | null) => void;
  toggleHighlight: (word: string) => void;
  vocabulary: VocabWord[];
  setVocabulary: (v: VocabWord[]) => void;
  activeVocab: VocabWord | null;
}

const HighlightWordContext = createContext<HighlightWordContextValue | null>(null);

export const normalizeWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9'-]/g, "");

export const HighlightWordProvider = ({ children }: { children: ReactNode }) => {
  const [highlightWord, setHighlightWord] = useState<string | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabWord[]>([]);

  const toggleHighlight = useCallback((word: string) => {
    setHighlightWord((prev) =>
      normalizeWord(prev ?? "") === normalizeWord(word) ? null : word
    );
  }, []);

  const activeVocab = useMemo(() => {
    if (!highlightWord) return null;
    const norm = normalizeWord(highlightWord);
    return vocabulary.find((v) => normalizeWord(v.word) === norm) ?? null;
  }, [highlightWord, vocabulary]);

  return (
    <HighlightWordContext.Provider
      value={{ highlightWord, setHighlightWord, toggleHighlight, vocabulary, setVocabulary, activeVocab }}
    >
      {children}
    </HighlightWordContext.Provider>
  );
};

export const useHighlightWord = () => {
  const ctx = useContext(HighlightWordContext);
  if (!ctx) {
    return {
      highlightWord: null,
      setHighlightWord: () => {},
      toggleHighlight: () => {},
      vocabulary: [] as VocabWord[],
      setVocabulary: () => {},
      activeVocab: null,
    };
  }
  return ctx;
};
