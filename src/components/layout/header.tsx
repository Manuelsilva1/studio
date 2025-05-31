
import Link from 'next/link';
import { BookOpen, ShoppingCart, Settings } from 'lucide-react';
import { CorreoLibroLogo } from '@/components/icons/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import type { Dictionary } from '@/types'; // Updated import

interface HeaderProps {
  lang: string;
  dictionary: Dictionary;
}

export function Header({ lang, dictionary }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
          <CorreoLibroLogo className="h-8 w-8" />
          <span className="font-headline text-2xl font-bold">{dictionary.siteName}</span>
        </Link>
        <nav className="flex items-center space-x-1 lg:space-x-2">
          <Link href={`/${lang}/catalog`} legacyBehavior passHref>
            <Button variant="ghost" className="text-sm font-medium">
              <BookOpen className="mr-2 h-4 w-4" /> {dictionary.header.catalog}
            </Button>
          </Link>
          <Link href={`/${lang}/cart`} legacyBehavior passHref>
            <Button variant="ghost" className="text-sm font-medium">
              <ShoppingCart className="mr-2 h-4 w-4" /> {dictionary.header.cart}
            </Button>
          </Link>
          <ThemeToggle />
          <LanguageSwitcher dictionary={dictionary} />
          <Link href={`/${lang}/admin`} legacyBehavior passHref>
            <Button variant="ghost" size="icon" aria-label={dictionary.header.admin}>
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
