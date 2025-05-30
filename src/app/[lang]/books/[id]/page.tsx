import { PublicLayout } from '@/components/layout/public-layout';
import { getBookById, mockBooks } from '@/lib/mock-data'; 
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { LightboxClient } from './components/lightbox-client';
import { CartProvider, useCart } from '@/context/cart-provider'; 
import { getDictionary, type Dictionary } from '@/lib/dictionaries';


// Update generateStaticParams for multiple locales
export async function generateStaticParams({ params: { lang: langParam } }: { params: { lang: string } }) {
  const locales = ['en', 'es']; // Or from your i18n config
  const params: { lang: string; id: string }[] = [];

  locales.forEach(lang => {
    mockBooks.forEach(book => {
      params.push({ lang, id: book.id });
    });
  });
  return params;
}


function AddToCartButtonWrapper({ book, dictionary }: { book: import('@/types').Book, dictionary: Dictionary }) {
  "use client"; 
  const { addToCart } = useCart();
  // Dynamic import for useToast as it's a client hook
  const { useToast } = require('@/hooks/use-toast'); 
  const { toast } = useToast();


  const handleAddToCart = () => {
    addToCart(book);
    toast({
      // These toast messages would also ideally come from the dictionary
      title: "Added to cart", 
      description: `${book.title} has been added to your cart.`,
    });
  };

  return (
    <Button size="lg" onClick={handleAddToCart} disabled={book.stock <= 0} className="w-full sm:w-auto">
      <ShoppingCart className="mr-2 h-5 w-5" />
      {/* This text should also be internationalized */}
      {book.stock > 0 ? `Add to Cart - $${book.price.toFixed(2)}` : 'Out of Stock'}
    </Button>
  );
}

interface BookDetailPageProps {
  params: { 
    id: string;
    lang: string;
  };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id, lang } = params;
  const book = getBookById(id);
  const dictionary = await getDictionary(lang);

  if (!book) {
    notFound();
  }

  return (
    <CartProvider> 
      <PublicLayout lang={lang} dictionary={dictionary}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <LightboxClient
                src={book.coverImage}
                alt={book.title}
                width={600}
                height={900}
                triggerClassName="w-full max-w-md mx-auto"
                data-ai-hint={`${book.genre} book cover detail`}
              />
            </div>

            <div className="space-y-6">
              <h1 className="font-headline text-4xl lg:text-5xl font-bold text-primary">{book.title}</h1>
              {/* "By" should be internationalized */}
              <p className="text-xl text-muted-foreground">
                By <span className="font-semibold text-foreground">{book.author}</span>
              </p>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">{book.genre}</Badge>
                {/* "Published" should be internationalized */}
                {book.publishedYear && <Badge variant="outline" className="text-sm px-3 py-1">Published: {book.publishedYear}</Badge>}
              </div>

              {book.themes && book.themes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {/* "Themes" should be internationalized */}
                  <span className="text-sm font-semibold">Themes:</span>
                  {book.themes.map(theme => (
                    <Badge key={theme} variant="outline" className="text-xs">{theme}</Badge>
                  ))}
                </div>
              )}

              <p className="text-lg text-foreground/90 leading-relaxed">{book.description}</p>
              
              {book.isbn && <p className="text-sm text-muted-foreground">ISBN: {book.isbn}</p>}

              <div className="pt-4">
                <AddToCartButtonWrapper book={book} dictionary={dictionary}/>
              </div>
            </div>
          </div>
          {/* The SummaryClient would also need 'lang' and 'dictionary' if it had text */}
          {/* <SummaryClient book={book} /> */}
        </div>
      </PublicLayout>
    </CartProvider>
  );
}
