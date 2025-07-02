'use client';

import { AchieveXProvider } from "@/contexts/AchieveXContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AchieveXProvider>
        {children}
      </AchieveXProvider>
    </QueryClientProvider>
  );
} 