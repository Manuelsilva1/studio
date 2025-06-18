
import { PublicLayout } from '@/components/layout/public-layout';
// Import the new getBookById from API service
import { getBookById, getBooks } from '@/services/api'; 
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
// Keep Category and Editorial types if you plan to fetch and display their names
import type { Book, Category, Editorial, Dictionary } from '@/types'; 
import { getDictionary } from '@/lib/dictionaries';
// Remove mockBooks if no longer needed for generateStaticParams or other parts
// import { mockBooks } from '@/lib/mock-data'; 
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, AlertTriangle, Link } from 'lucide-react'; // Added AlertTriangle for errors
import { LightboxClient } from '@/app/books/[id]/components/lightbox-client';
import { CartProvider } from '@/context/cart-provider';
import { useCart } from '@/hooks/use-cart';

// getDictionary is already imported
// Dictionary type is already imported
import { useToast } from '@/hooks/use-toast'; 

// Updated generateStaticParams to use the API
export async function generateStaticParams() {
  try {
    const books = await getBooks(); // Fetch all books
    const locales = ['en', 'es']; // Or from your i18n config
    const params: { lang: string; id: string }[] = [];

    locales.forEach(lang => {
      books.forEach(book => {
        // Ensure book.id is a string, as params usually are.
        params.push({ lang, id: String(book.id) });
      });
    });
    return params;
  } catch (error) {
    console.error("Failed to generate static params for book pages:", error);
    return []; // Return empty array on error to prevent build failure
  }
}

// The Book type is now imported from @/types
function AddToCartButtonWrapper({ book, dictionary }: { book: Book, dictionary: Dictionary }) {
  "use client"; 
  const { addToCart } = useCart();
  const { toast } = useToast(); 

  const handleAddToCart = () => {
    // Ensure book passed to addToCart matches the expected type if CartContext was updated
    addToCart(book); 
    toast({
      title: dictionary.cartPage?.addedToCartTitle || "Added to cart", 
      description: `${book.titulo} ${dictionary.cartPage?.addedToCartDescription || "has been added to your cart."}`, // Use book.titulo
    });
  };

  return (
    <Button size="lg" onClick={handleAddToCart} disabled={book.stock <= 0} className="w-full sm:w-auto">
      <ShoppingCart className="mr-2 h-5 w-5" />
      {book.stock > 0 ? `${dictionary.catalogPage?.addToCartButton || 'Add to Cart'} - UYU ${book.precio.toFixed(2)}` : (dictionary.catalogPage?.outOfStockButton || 'Out of Stock')} 
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
  const dictionary = await getDictionary(lang);
  let book: Book | null = null;
  let fetchError: string | null = null;

  try {
    book = await getBookById(id);
  } catch (error: any) {
    console.error(`Failed to fetch book with ID ${id}:`, error);
    if (error.statusCode === 404) {
      notFound(); // Trigger Next.js 404 page
    }
    fetchError = error.message || "Failed to load book details.";
  }

  if (fetchError) {
    return (
      <PublicLayout lang={lang} dictionary={dictionary}>
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-red-700">Error</h1>
          <p className="mt-2 text-red-600">{fetchError}</p>
          <Link href={`/${lang}/catalog`} className="mt-6 inline-block">
            <Button variant="outline">Back to Catalog</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }
  
  if (!book) { // Should be caught by error handling or notFound() earlier, but as a safeguard
    notFound();
  }
  
  const pageDictionary = { // Ensure dictionary props are robust
    ...dictionary,
    cartPage: dictionary.cartPage || { addedToCartTitle: "Added to cart", addedToCartDescription: "has been added to your cart." },
    catalogPage: dictionary.catalogPage || { addToCartButton: "Add to Cart", outOfStockButton: "Out of Stock" },
    bookDetailPage: dictionary.bookDetailPage || { byAuthorPrefix: "By", publishedPrefix: "Published", themesPrefix: "Themes" }
  };

  // TODO: Fetch category and editorial names if IDs are present and names are needed
  // For now, we'll display IDs or placeholders if names aren't directly on the book object.
  // const categoryName = book.categoriaId; // Placeholder, ideally fetch Category details
  // const editorialName = book.editorialId; // Placeholder, ideally fetch Editorial details

  return (
    <CartProvider> 
      <PublicLayout lang={lang} dictionary={pageDictionary}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <LightboxClient
                src={book.coverImage || '/placeholder-image.png'} // Fallback image
                alt={book.titulo}
                width={600}
                height={900}
                triggerClassName="w-full max-w-md mx-auto"
                // data-ai-hint={`${book.genre} book cover detail`} // genre might not be directly available
              />
            </div>

            <div className="space-y-6">
              <h1 className="font-headline text-4xl lg:text-5xl font-bold text-primary">{book.titulo}</h1>
              <p className="text-xl text-muted-foreground">
                {pageDictionary.bookDetailPage?.byAuthorPrefix || "By"} <span className="font-semibold text-foreground">{book.autor}</span>
              </p>
              
              <div className="flex items-center space-x-2">
                {/* Replace book.genre with category if applicable, or fetch category name */}
                {book.categoriaId && <Badge variant="secondary" className="text-sm px-3 py-1">Category ID: {book.categoriaId}</Badge>}
                {/* book.publishedYear might not be on the new Book type, remove or adapt if needed */}
                {/* {book.publishedYear && <Badge variant="outline" className="text-sm px-3 py-1">{pageDictionary.bookDetailPage?.publishedPrefix || "Published"}: {book.publishedYear}</Badge>} */}
              </div>

              {/* book.themes might not be on the new Book type, remove or adapt if needed */}
              {/* {book.themes && book.themes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-semibold">{pageDictionary.bookDetailPage?.themesPrefix || "Themes"}:</span>
                  {book.themes.map(theme => (
                    <Badge key={theme} variant="outline" className="text-xs">{theme}</Badge>
                  ))}
                </div>
              )} */}

              <p className="text-lg text-foreground/90 leading-relaxed">{book.descripcion || "No description available."}</p>
              
              {book.isbn && <p className="text-sm text-muted-foreground">ISBN: {book.isbn}</p>}
              <p className="text-sm text-muted-foreground">Stock: {book.stock}</p>
              {book.editorialId && <p className="text-sm text-muted-foreground">Editorial ID: {book.editorialId}</p>}


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
