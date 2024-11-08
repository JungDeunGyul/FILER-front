import { useEffect, Dispatch, SetStateAction } from "react";
import { throttle } from "../throttle";

interface useScrollHandlerProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  setFilesToShow: Dispatch<SetStateAction<number>>;
}

export const useScrollHandler = ({
  scrollContainerRef,
  setFilesToShow,
}: useScrollHandlerProps) => {
  const handleScroll = throttle(() => {
    const container = scrollContainerRef.current;

    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setFilesToShow((prev) => prev + 6);
      }
    }
  }, 500);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll, scrollContainerRef]);
};
