"use client";

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

interface ClientLayoutProvidersProps {
  children: ReactNode;
}

export function ClientLayoutProviders({ children }: ClientLayoutProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* This inner div helps with flex layouts if children need to expand */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
