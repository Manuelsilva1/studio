
import { PublicLayout } from '@/components/layout/public-layout';
import { getBookById, mockBooks } from '@/lib/mock-data'; 
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { LightboxClient } from './components/lightbox-client';
import { CartProvider, useCart } from '@/context/cart-provider'; 
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/types';
import { useToast } from '@/hooks/use-toast'; // Changed from require to import

export async function generateStaticParams({ params: { lang: langParam } }: { params: { lang: string } }) {
  const locales = ['en', 'es']; 
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
  // const { useToast } = require('@/hooks/use-toast'); // Original line
  const { toast } = useToast(); // useToast imported at the top of the file

  const handleAddToCart = () => {
    addToCart(book);
    toast({
      title: dictionary.cartPage?.addedToCartTitle || "Added to cart", 
      description: `${book.title} ${dictionary.cartPage?.addedToCartDescription || "has been added to your cart."}`,
    });
  };

  return (
    <Button size="lg" onClick={handleAddToCart} disabled={book.stock <= 0} className="w-full sm:w-auto">
      <ShoppingCart className="mr-2 h-5 w-5" />
      {book.stock > 0 ? `${dictionary.catalogPage?.addToCartButton || 'Add to Cart'} - UYU ${book.price.toFixed(2)}` : (dictionary.catalogPage?.outOfStockButton || 'Out of Stock')}
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
  
  // Ensure dictionary paths exist or provide fallbacks for AddToCartButtonWrapper
  const pageDictionary = {
    ...dictionary,
    cartPage: dictionary.cartPage || { addedToCartTitle: "Added to cart", addedToCartDescription: "has been added to your cart." },
    catalogPage: dictionary.catalogPage || { addToCartButton: "Add to Cart", outOfStockButton: "Out of Stock" }
  };


  return (
    <CartProvider> 
      <PublicLayout lang={lang} dictionary={pageDictionary}>
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
              <p className="text-xl text-muted-foreground">
                {dictionary.bookDetailPage?.byAuthorPrefix || "By"} <span className="font-semibold text-foreground">{book.author}</span>
              </p>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">{book.genre}</Badge>
                {book.publishedYear && <Badge variant="outline" className="text-sm px-3 py-1">{dictionary.bookDetailPage?.publishedPrefix || "Published"}: {book.publishedYear}</Badge>}
              </div>

              {book.themes && book.themes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-semibold">{dictionary.bookDetailPage?.themesPrefix || "Themes"}:</span>
                  {book.themes.map(theme => (
                    <Badge key={theme} variant="outline" className="text-xs">{theme}</Badge>
                  ))}
                </div>
              )}

              <p className="text-lg text-foreground/90 leading-relaxed">{book.description}</p>
              
              {book.isbn && <p className="text-sm text-muted-foreground">ISBN: {book.isbn}</p>}

              <div className="pt-4">
                <AddToCartButtonWrapper book={book} dictionary={pageDictionary}/>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    </CartProvider>
  );
}

// Ensure your dictionary types are updated to include these new keys if you use them:
// cartPage: { addedToCartTitle: string; addedToCartDescription: string; ... }
// catalogPage: { addToCartButton: string; outOfStockButton: string; ... }
// bookDetailPage: { byAuthorPrefix: string; publishedPrefix: string; themesPrefix: string; ...}
