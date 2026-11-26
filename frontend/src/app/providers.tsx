import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

const client = new QueryClient();

function AppProviders({ children }: ProvidersProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default AppProviders;
