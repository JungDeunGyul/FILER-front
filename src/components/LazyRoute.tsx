import { Suspense, ReactElement } from "react";
import { Route } from "react-router-dom";

import LoadingFallback from "@components/LoadingFallback";

interface LazyRouteProps {
  children: ReactElement<typeof Route>;
  loadingMessage: string;
}

const LazyRoute = ({ children, loadingMessage }: LazyRouteProps) => {
  return (
    <Suspense fallback={<LoadingFallback message={loadingMessage} />}>
      {children}
    </Suspense>
  );
};

export default LazyRoute;
