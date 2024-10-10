import { throttle } from "./throttle";

export const scrollHandler = (scrollContainerRef, setFilesToShow) => {
  return throttle(() => {
    const container = scrollContainerRef.current;

    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setFilesToShow((prev) => prev + 6);
      }
    }
  }, 500);
};
