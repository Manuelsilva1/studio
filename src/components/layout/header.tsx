import Link from 'next/link';
import { BookOpen, ShoppingCart, UserCircle, Settings } from 'lucide-react';
import { CorreoLibroLogo } from '@/components/icons/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
          <CorreoLibroLogo className="h-8 w-8" />
          <span className="font-headline text-2xl font-bold">CorreoLibro</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link href="/catalog" legacyBehavior passHref>
            <Button variant="ghost" className="text-sm font-medium">
              <BookOpen className="mr-2 h-4 w-4" /> Catalog
            </Button>
          </Link>
          <Link href="/cart" legacyBehavior passHref>
            <Button variant="ghost" className="text-sm font-medium">
              <ShoppingCart className="mr-2 h-4 w-4" /> Cart
            </Button>
          </Link>
          <Link href="/admin" legacyBehavior passHref>
            <Button variant="ghost" className="text-sm font-medium">
              <Settings className="mr-2 h-4 w-4" /> Admin
            </Button>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
