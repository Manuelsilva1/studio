import type { ReactNode } from 'react';
import AdminPanelShell from './components/admin-shell';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/types';

interface AdminPanelLayoutProps {
  children: ReactNode;
  params: {
    lang: string;
  };
}

export default async function AdminPanelLayout({ children, params: { lang } }: AdminPanelLayoutProps) {
  const dictionary: Dictionary = await getDictionary(lang);
  return (
    <AdminPanelShell lang={lang} dictionary={dictionary}>
      {children}
    </AdminPanelShell>
  );
}
