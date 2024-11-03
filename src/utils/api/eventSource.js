import { useEffect } from "react";

export const useEventSource = (queryClient, loginUserId) => {
  useEffect(() => {
    const source = new EventSource(
      `${import.meta.env.VITE_SERVER_URL}/team/filer-stream/${loginUserId}`,
    );

    source.onmessage = () => {
      queryClient.invalidateQueries(["userData"]);
    };

    return () => {
      source.close();
    };
  }, [loginUserId, queryClient]);
};
