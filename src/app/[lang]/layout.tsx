// src/app/[lang]/layout.tsx
import type { ReactNode } from 'react';
import { ClientLayoutProviders } from './components/client-layout-providers';
import { getDictionary } from '@/lib/dictionaries';
import type { Metadata, Viewport } from 'next';
// Global CSS is in src/app/layout.tsx
// Global fonts are initialized in src/app/layout.tsx and available via CSS variables

interface LangLayoutProps {
  children: ReactNode;
  params: { lang: string };
}

export async function generateMetadata({ params: { lang } }: LangLayoutProps): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: {
      default: dictionary.siteName,
      template: `%s | ${dictionary.siteName}`,
    },
    description: dictionary.description,
    // icons: { icon: '/favicon.ico' } // Next.js handles favicon.ico from app/ or public/ automatically
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(var(--background))' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(var(--background))' },
  ],
};

export default function LangLayout({ children, params }: LangLayoutProps) {
  return (
    // This div takes on the flex properties to fill the body
    <div data-lang={params.lang} className="flex-1 flex flex-col">
      <ClientLayoutProviders>
        {children}
      </ClientLayoutProviders>
    </div>
  );
}
