import { useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";

interface UseEventSourceParams {
  queryClient: QueryClient;
  loginUserId: string;
}

export const useEventSource = ({
  queryClient,
  loginUserId,
}: UseEventSourceParams) => {
  useEffect(() => {
    const source = new EventSource(
      `${import.meta.env.VITE_SERVER_URL}/team/filer-stream/${loginUserId}`,
    );

    source.onmessage = () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    };

    return () => {
      source.close();
    };
  }, [loginUserId, queryClient]);
};
