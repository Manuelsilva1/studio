"use client";

import type { Book } from '@/types';
import { BookCard } from './book-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface RecommendationsClientProps {
  recommendedBooks: Book[];
  isLoading: boolean;
}

export function RecommendationsClient({ recommendedBooks, isLoading }: RecommendationsClientProps) {
  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center text-primary">
            <Sparkles className="mr-2 h-6 w-6" /> AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading recommendations...</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse bg-muted rounded-lg p-4 h-96">
                <div className="w-full h-48 bg-muted-foreground/20 rounded mb-4"></div>
                <div className="h-6 w-3/4 bg-muted-foreground/20 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-muted-foreground/20 rounded mb-4"></div>
                <div className="h-8 w-full bg-muted-foreground/20 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendedBooks.length === 0) {
    return null; // Don't show the section if there are no recommendations and not loading
  }

  return (
    <Card className="mt-12 shadow-lg rounded-lg bg-accent/20 border-accent">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center text-primary">
          <Sparkles className="mr-2 h-6 w-6" /> AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">Based on your filters, you might also like these books:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendedBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
