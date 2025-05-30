import { PublicLayout } from '@/components/layout/public-layout';
import { getBookById, mockBooks } from '@/lib/mock-data'; // Using mock data
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, BookOpenCheck } from 'lucide-react';
import { SummaryClient } from './components/summary-client';
import { LightboxClient } from './components/lightbox-client';
import { CartProvider, useCart } from '@/context/cart-provider'; // useCart needs provider
import { AddToCartButton } from './components/add-to-cart-button'; // Separate client component for button

export async function generateStaticParams() {
  // For SSG, generate paths for all mock books
  return mockBooks.map(book => ({
    id: book.id,
  }));
}

// Client component to handle add to cart logic
function AddToCartButtonWrapper({ book }: { book: import('@/types').Book }) {
  "use client"; // This component needs to be a client component
  const { addToCart } = useCart();
  const { useToast } = await import('@/hooks/use-toast'); // Dynamically import for client-side use
  const { toast } = useToast();


  const handleAddToCart = () => {
    addToCart(book);
    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart.`,
    });
  };

  return (
    <Button size="lg" onClick={handleAddToCart} disabled={book.stock <= 0} className="w-full sm:w-auto">
      <ShoppingCart className="mr-2 h-5 w-5" />
      {book.stock > 0 ? `Add to Cart - $${book.price.toFixed(2)}` : 'Out of Stock'}
    </Button>
  );
}


export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = getBookById(params.id);

  if (!book) {
    notFound();
  }

  return (
    <CartProvider> {/* Provider needed for AddToCartButtonWrapper */}
      <PublicLayout>
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
                By <span className="font-semibold text-foreground">{book.author}</span>
              </p>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">{book.genre}</Badge>
                {book.publishedYear && <Badge variant="outline" className="text-sm px-3 py-1">Published: {book.publishedYear}</Badge>}
              </div>

              {book.themes && book.themes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-semibold">Themes:</span>
                  {book.themes.map(theme => (
                    <Badge key={theme} variant="outline" className="text-xs">{theme}</Badge>
                  ))}
                </div>
              )}

              <p className="text-lg text-foreground/90 leading-relaxed">{book.description}</p>
              
              {book.isbn && <p className="text-sm text-muted-foreground">ISBN: {book.isbn}</p>}

              <div className="pt-4">
                <AddToCartButtonWrapper book={book} />
              </div>
            </div>
          </div>

          <SummaryClient book={book} />

        </div>
      </PublicLayout>
    </CartProvider>
  );
}

