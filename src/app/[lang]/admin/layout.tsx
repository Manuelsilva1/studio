
import type { ReactNode } from 'react';
import Link from 'next/link';
import { CorreoLibroLogo } from '@/components/icons/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, BookCopy, Users, Home } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';


interface AdminLayoutProps {
  children: ReactNode;
  params: {
    lang: string;
  };
}

async function AdminHeader({ lang, dictionary }: { lang: string, dictionary: Dictionary }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${lang}/admin`} className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
          <CorreoLibroLogo className="h-8 w-8" />
          <span className="font-headline text-xl font-bold">{dictionary.siteName} Admin</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Link href={`/${lang}/`} passHref legacyBehavior>
            <Button variant="ghost" size="sm"><Home className="mr-2 h-4 w-4"/>Storefront</Button>
          </Link>
          <ThemeToggle />
          <LanguageSwitcher dictionary={dictionary}/>
        </div>
      </div>
    </header>
  );
}

function AdminSidebarNav({ lang }: { lang: string }) {
  // For a fully translated admin panel, pass dictionary here too
  return (
    <nav className="flex flex-col space-y-2 p-4">
      <Link href={`/${lang}/admin`} passHref legacyBehavior>
        <Button variant="ghost" className="justify-start w-full">
          <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
        </Button>
      </Link>
      <Link href={`/${lang}/admin/books`} passHref legacyBehavior>
        <Button variant="ghost" className="justify-start w-full">
          <BookCopy className="mr-2 h-4 w-4" /> Manage Books
        </Button>
      </Link>
       <Button variant="ghost" className="justify-start w-full" disabled>
          <Users className="mr-2 h-4 w-4" /> Manage Users (Soon)
        </Button>
    </nav>
  );
}


export default async function AdminLayout({ children, params: { lang } }: AdminLayoutProps) {
  const dictionary = await getDictionary(lang);
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader lang={lang} dictionary={dictionary} />
      <div className="container mx-auto flex-1 px-0 md:px-4">
        <div className="grid md:grid-cols-[240px_1fr] gap-0 md:gap-8">
          <aside className="hidden md:block border-r py-6">
            <AdminSidebarNav lang={lang} />
          </aside>
          <main className="py-6 px-4 md:px-0">{children}</main>
        </div>
      </div>
       <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        Admin Panel - {dictionary.footer.copyright.replace('{year}', currentYear.toString())}
      </footer>
    </div>
  );
}
