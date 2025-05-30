
import type { ReactNode } from 'react';
import { PublicLayout } from '@/components/layout/public-layout';
import { getDictionary } from '@/lib/dictionaries';

interface AdminLoginLayoutProps {
  children: ReactNode;
  params: { lang: string };
}

export default async function AdminLoginLayout({ children, params }: AdminLoginLayoutProps) {
  const dictionary = await getDictionary(params.lang);
  // This layout is for the /admin route, which will be the login page.
  // It uses PublicLayout for a consistent look with the rest of the site,
  // but centers the content for a typical login form presentation.
  return (
    <PublicLayout lang={params.lang} dictionary={dictionary}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-8 px-4">
        {children}
      </div>
    </PublicLayout>
  );
}
