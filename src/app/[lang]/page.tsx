
import Link from 'next/link';
import { CorreoLibroLogo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { PublicLayout } from '@/components/layout/public-layout';
import { ArrowRight } from 'lucide-react';
import { getDictionary } from '@/lib/dictionaries';

interface SplashPageProps {
  params: {
    lang: string;
  };
}

export default async function SplashPage({ params: { lang } }: SplashPageProps) {
  const dictionary = await getDictionary(lang);

  return (
    <PublicLayout lang={lang} dictionary={dictionary}>
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4 py-16">
        <CorreoLibroLogo className="h-48 w-48 text-primary mb-8" />
        <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 text-primary">
          {dictionary.splashPage.welcome}
        </h1>
        <p className="text-xl text-foreground/80 mb-12 max-w-2xl">
          {dictionary.splashPage.tagline}
        </p>
        <Link href={`/${lang}/catalog`} passHref legacyBehavior>
          <Button size="lg" className="font-headline text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            {dictionary.splashPage.enterCatalog} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </PublicLayout>
  );
}
