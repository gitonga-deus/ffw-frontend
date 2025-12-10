'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { Toaster } from '@/components/ui/sonner';
import { useState, useEffect } from 'react';
import { useTokenRefresh } from '@/hooks/use-token-refresh';

function TokenRefreshProvider() {
  useTokenRefresh();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TokenRefreshProvider />
      {children}
      {mounted && <Toaster position="top-right" richColors />}
    </QueryClientProvider>
  );
}
