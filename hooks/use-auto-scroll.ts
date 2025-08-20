import { useEffect, useRef, useState } from "react";

export const useAutoScroll = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const [isAtTop, setIsAtTop] = useState<boolean>(true);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const checkScrollPosition = () => {
      const isScrollable = container.scrollHeight > container.clientHeight;
      const atBottom =
        !isScrollable ||
        Math.abs(
          container.scrollHeight - container.scrollTop - container.clientHeight
        ) < 1;
      const atTop = container.scrollTop <= 1;
      setIsAtBottom(atBottom);
      setIsAtTop(atTop);
    };

    container.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition();

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior });
    }
  };

  const scrollToTop = (behavior: ScrollBehavior = "smooth") => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior });
    }
  };

  return { scrollRef, isAtBottom, isAtTop, scrollToBottom, scrollToTop };
};
