import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"enter" | "exit">("enter");
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      setTransitionStage("exit");
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage("enter");
        prevPathRef.current = location.pathname;
      }, 180);
      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [location.pathname, children]);

  return (
    <div
      className="transition-all duration-[180ms] ease-out"
      style={{
        opacity: transitionStage === "exit" ? 0 : 1,
        transform: transitionStage === "exit" ? "translateY(6px) scale(0.99)" : "translateY(0) scale(1)",
      }}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
