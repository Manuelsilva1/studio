
import type { ReactNode } from 'react';
import Link from 'next/link';
import { CorreoLibroLogo } from '@/components/icons/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, BookCopy, Users, Home, Store, Receipt, Building2 } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/types';

interface AdminPanelLayoutProps {
  children: ReactNode;
  params: {
    lang: string;
  };
}

async function AdminPanelHeader({ lang, dictionary }: { lang: string, dictionary: Dictionary }) {
  const adminTexts = dictionary.adminPanel?.header || { titleSuffix: "Admin", storefrontLink: "Storefront" };
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur h-16">
      <div className="container flex h-full items-center justify-between">
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
    statusSoon: "(Soon)",
    pointOfSale: "Point of Sale",
    sales: "Sales", 
    manageEditorials: "Manage Publishers"
  };
  return (
    <nav className="flex flex-col space-y-2 p-4">
      <Link href={`/${lang}/admin/panel`} passHref legacyBehavior scroll={false}>
        <Button variant="ghost" className="justify-start w-full">
          <LayoutDashboard className="mr-2 h-4 w-4" /> {sidebarTexts.dashboard}
        </Button>
      </Link>
      <Link href={`/${lang}/admin/panel/books`} passHref legacyBehavior scroll={false}>
        <Button variant="ghost" className="justify-start w-full">
          <BookCopy className="mr-2 h-4 w-4" /> {sidebarTexts.manageBooks}
        </Button>
      </Link>
      <Link href={`/${lang}/admin/panel/editorials`} passHref legacyBehavior scroll={false}>
        <Button variant="ghost" className="justify-start w-full">
          <Building2 className="mr-2 h-4 w-4" /> {sidebarTexts.manageEditorials}
        </Button>
      </Link>
      <Link href={`/${lang}/admin/panel/pos`} passHref legacyBehavior scroll={false}>
        <Button variant="ghost" className="justify-start w-full">
          <Store className="mr-2 h-4 w-4" /> {sidebarTexts.pointOfSale}
        </Button>
      </Link>
      <Link href={`/${lang}/admin/panel/sales`} passHref legacyBehavior scroll={false}>
        <Button variant="ghost" className="justify-start w-full">
          <Receipt className="mr-2 h-4 w-4" /> {sidebarTexts.sales}
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
      <AdminPanelHeader lang={lang} dictionary={dictionary} /> {/* Header height is h-16 (4rem) */}
      
      <div className="flex flex-1 overflow-hidden"> {/* This div groups sidebar and main content, taking remaining height */}
        
        {/* Sidebar */}
        <aside className="hidden md:block w-[240px] shrink-0 border-r bg-background py-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          {/* `top-16` matches header height. `h-[calc(100vh-4rem)]` fits viewport below header. `shrink-0` prevents shrinking. */}
          <AdminPanelSidebarNav lang={lang} dictionary={dictionary} />
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto md:pl-8"> {/* `md:pl-8` creates gap from sidebar on md+ screens */}
          <div className="container mx-auto py-6"> {/* Standard container for content padding and max-width */}
            {children}
          </div>
        </main>
        
      </div>
      
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        {footerText} - {dictionary.footer.copyright.replace('{year}', currentYear.toString())}
      </footer>
    </div>
  );
}
