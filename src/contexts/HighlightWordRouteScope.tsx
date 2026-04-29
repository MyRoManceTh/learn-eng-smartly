import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HighlightWordProvider, useHighlightWord } from "@/contexts/HighlightWordContext";
import HighlightWordPopover from "@/components/HighlightWordPopover";

const RouteHighlightReset = () => {
  const location = useLocation();
  const { setHighlightWord } = useHighlightWord();
  useEffect(() => {
    setHighlightWord(null);
  }, [location.pathname, setHighlightWord]);
  return null;
};

export const HighlightWordRouteScope = ({ children }: { children: React.ReactNode }) => (
  <HighlightWordProvider>
    <RouteHighlightReset />
    {children}
    <HighlightWordPopover />
  </HighlightWordProvider>
);
