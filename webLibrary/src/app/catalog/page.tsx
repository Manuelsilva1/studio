"use client"; 

import { useState, useEffect, useCallback } from 'react';
import type { Book } from '@/types';
import { mockBooks, getGenres, getAuthors } from '@/lib/mock-data';
// import { getCatalogRecommendations, type CatalogRecommendationsInput } from '@/ai/flows/catalog-recommendations'; // AI Import Removed
import { PublicLayout } from '@/components/layout/public-layout';
import { BookCard } from './components/book-card';
import { FiltersClient, type CatalogFilters } from './components/filters-client';
// import { RecommendationsClient } from './components/recommendations-client'; // AI Recommendations Client Removed
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CartProvider } from '@/context/cart-provider';


const ITEMS_PER_PAGE = 8;
const initialFilters: CatalogFilters = {
  genre: 'all',
  author: 'all',
  minPrice: '',
  maxPrice: '',
  sortBy: 'relevance',
};

export default function CatalogPage() {
  const [allBooks] = useState<Book[]>(mockBooks);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(allBooks);
  const [displayedBooks, setDisplayedBooks]  = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<CatalogFilters>(initialFilters);
  
  const [genres] = useState<string[]>(getGenres());
  const [authors] = useState<string[]>(getAuthors());

  // const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]); // AI State Removed
  // const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false); // AI State Removed
  const { toast } = useToast();

  const applyFiltersAndSearch = useCallback(() => {
    let books = [...allBooks];

    if (searchTerm) {
      books = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilters.genre !== 'all') {
      books = books.filter(book => book.genre === activeFilters.genre);
    }
    if (activeFilters.author !== 'all') {
      books = books.filter(book => book.author === activeFilters.author);
    }
    if (activeFilters.minPrice !== '') {
      books = books.filter(book => book.price >= Number(activeFilters.minPrice));
    }
    if (activeFilters.maxPrice !== '') {
      books = books.filter(book => book.price <= Number(activeFilters.maxPrice));
    }
    
    switch (activeFilters.sortBy) {
      case 'price_asc':
        books.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        books.sort((a, b) => b.price - a.price);
        break;
      case 'title_asc':
        books.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        books.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    setFilteredBooks(books);
    setCurrentPage(1); 
  }, [allBooks, searchTerm, activeFilters]);


  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchTerm, activeFilters, applyFiltersAndSearch]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedBooks(filteredBooks.slice(startIndex, endIndex));
  }, [filteredBooks, currentPage]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const handleFilterChange = (filters: CatalogFilters) => {
    setActiveFilters(filters);
    // AI Recommendations logic removed
  };

  const handleResetFilters = () => {
    setActiveFilters(initialFilters);
    setSearchTerm('');
    // setRecommendedBooks([]); // AI State Removed
  };

  return (
    <CartProvider> 
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-headline text-4xl font-bold mb-8 text-center text-primary">Book Catalog</h1>
          
          <div className="mb-8 relative">
            <Input 
              type="text"
              placeholder="Search by title, author, or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-base"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <FiltersClient
                genres={genres}
                authors={authors}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                initialFilters={initialFilters}
              />
            </div>

            <div className="md:col-span-3">
              {displayedBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedBooks.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">No books match your criteria.</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <span className="text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
          {/* <RecommendationsClient recommendedBooks={recommendedBooks} isLoading={isRecommendationsLoading} /> // AI Recommendations Client Removed */}
        </div>
      </PublicLayout>
    </CartProvider>
  );
}
