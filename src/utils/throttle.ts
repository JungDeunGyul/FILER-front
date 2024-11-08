type ThrottleCallback = () => void;

export const throttle = (callback: ThrottleCallback, delay: number) => {
  let isThrottled = false;

  return () => {
    if (!isThrottled) {
      callback();
      isThrottled = true;

      setTimeout(() => (isThrottled = false), delay);
    }
  };
};
