
import type { ReactNode } from 'react';
import Link from 'next/link';
import { CorreoLibroLogo } from '@/components/icons/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, BookCopy, Users, Home } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';

interface AdminPanelLayoutProps {
  children: ReactNode;
  params: {
    lang: string;
  };
}

async function AdminPanelHeader({ lang, dictionary }: { lang: string, dictionary: Dictionary }) {
  const adminTexts = dictionary.adminPanel?.header || { titleSuffix: "Admin", storefrontLink: "Storefront" };
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${lang}/admin/panel`} className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
          <CorreoLibroLogo className="h-8 w-8" />
          <span className="font-headline text-xl font-bold">{dictionary.siteName} {adminTexts.titleSuffix}</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Link href={`/${lang}/`} passHref legacyBehavior>
            <Button variant="ghost" size="sm"><Home className="mr-2 h-4 w-4"/>{adminTexts.storefrontLink}</Button>
          </Link>
          <ThemeToggle />
          <LanguageSwitcher dictionary={dictionary}/>
        </div>
      </div>
    </header>
  );
}

function AdminPanelSidebarNav({ lang, dictionary }: { lang: string, dictionary: Dictionary }) {
  const sidebarTexts = dictionary.adminPanel?.sidebar || { 
    dashboard: "Dashboard", 
    manageBooks: "Manage Books", 
    manageUsers: "Manage Users", 
    statusSoon: "(Soon)"
  };
  return (
    <nav className="flex flex-col space-y-2 p-4">
      <Link href={`/${lang}/admin/panel`} passHref legacyBehavior>
        <Button variant="ghost" className="justify-start w-full">
          <LayoutDashboard className="mr-2 h-4 w-4" /> {sidebarTexts.dashboard}
        </Button>
      </Link>
      <Link href={`/${lang}/admin/panel/books`} passHref legacyBehavior>
        <Button variant="ghost" className="justify-start w-full">
          <BookCopy className="mr-2 h-4 w-4" /> {sidebarTexts.manageBooks}
        </Button>
      </Link>
       <Button variant="ghost" className="justify-start w-full h-auto py-2 items-start" disabled>
          <Users className="mr-2 h-4 w-4 mt-1 flex-shrink-0" /> 
          <div className="flex flex-col text-left">
            <span>{sidebarTexts.manageUsers}</span>
            <span className="text-xs text-muted-foreground">{sidebarTexts.statusSoon}</span>
          </div>
        </Button>
    </nav>
  );
}


export default async function AdminPanelLayout({ children, params: { lang } }: AdminPanelLayoutProps) {
  const dictionary = await getDictionary(lang);
  const currentYear = new Date().getFullYear();
  const footerText = dictionary.adminPanel?.footer?.text || "Admin Panel";

  return (
    <div className="flex min-h-screen flex-col">
      <AdminPanelHeader lang={lang} dictionary={dictionary} />
      <div className="container mx-auto flex-1 px-0 md:px-4">
        <div className="grid md:grid-cols-[240px_1fr] gap-0 md:gap-8">
          <aside className="hidden md:block border-r py-6">
            <AdminPanelSidebarNav lang={lang} dictionary={dictionary} />
          </aside>
          <main className="py-6 px-4 md:px-0">{children}</main>
        </div>
      </div>
       <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        {footerText} - {dictionary.footer.copyright.replace('{year}', currentYear.toString())}
      </footer>
    </div>
  );
}
