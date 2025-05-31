
"use client";

import type { Book, Dictionary } from '@/types';
import { BookCard } from './book-card';
import { useEffect, useState } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface NewArrivalsClientProps {
  allBooks: Book[];
  lang: string;
  dictionary: Dictionary;
}

export function NewArrivalsClient({ allBooks, lang, dictionary }: NewArrivalsClientProps) {
  const [newBooks, setNewBooks] = useState<Book[]>([]);

  useEffect(() => {
    const today = new Date();
    let sevenDayBooks = allBooks.filter(book => {
      if (!book.dateAdded) return false;
      try {
        const addedDate = parseISO(book.dateAdded);
        return differenceInDays(today, addedDate) <= 7 && differenceInDays(today, addedDate) >= 0;
      } catch (e) {
        console.error("Error parsing dateAdded for book:", book.title, book.dateAdded, e);
        return false;
      }
    });

    // Sort by dateAdded descending (newest first)
    sevenDayBooks.sort((a, b) => {
        if (!a.dateAdded || !b.dateAdded) return 0;
        return parseISO(b.dateAdded).getTime() - parseISO(a.dateAdded).getTime()
    });

    if (sevenDayBooks.length > 0) {
      setNewBooks(sevenDayBooks.slice(0, 4)); // Limit to, say, 4 newest books
    } else {
      let thirtyDayBooks = allBooks.filter(book => {
        if (!book.dateAdded) return false;
        try {
            const addedDate = parseISO(book.dateAdded);
            return differenceInDays(today, addedDate) <= 30 && differenceInDays(today, addedDate) >= 0;
        } catch (e) {
            console.error("Error parsing dateAdded for book:", book.title, book.dateAdded, e);
            return false;
        }
      });
      thirtyDayBooks.sort((a, b) => {
        if (!a.dateAdded || !b.dateAdded) return 0;
        return parseISO(b.dateAdded).getTime() - parseISO(a.dateAdded).getTime()
      });
      setNewBooks(thirtyDayBooks.slice(0, 4)); 
    }
  }, [allBooks]);

  const newArrivalsTexts = dictionary.catalogPage?.newArrivalsSection || {
    title: "New Arrivals",
    noNewArrivals: "No new books in the last month. Check back soon!",
  };

  if (newBooks.length === 0) {
    // If you want to show a message when no new books, uncomment below
    // return (
    //   <div className="mb-8 text-center text-muted-foreground">
    //     {newArrivalsTexts.noNewArrivals}
    //   </div>
    // );
    return null; 
  }

  return (
    <Card className="mb-10 shadow-lg rounded-lg border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="font-headline text-2xl md:text-3xl text-primary flex items-center">
          <Sparkles className="mr-3 h-6 w-6" />
          {newArrivalsTexts.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newBooks.map(book => (
            <BookCard key={book.id} book={book} lang={lang} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
