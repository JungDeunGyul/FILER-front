export const throttle = (callback, delay) => {
  let isThrottled = false;

  return (...args) => {
    if (!isThrottled) {
      callback(...args);
      isThrottled = true;

      setTimeout(() => (isThrottled = false), delay);
    }
  };
};
