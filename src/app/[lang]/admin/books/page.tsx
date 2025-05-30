"use client"; 

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Added useRouter
import type { Book } from '@/types';
import { mockBooks } from '@/lib/mock-data'; 
import { BookFormClient } from './components/book-form-client';
import { BookListClient } from './components/book-list-client';
import { Loader2 } from 'lucide-react';

let adminMockBooks: Book[] = [...mockBooks];

async function getAdminBooks(): Promise<Book[]> {
  return new Promise(resolve => setTimeout(() => resolve([...adminMockBooks]), 200));
}

async function getAdminBookById(id: string): Promise<Book | undefined> {
  return new Promise(resolve => setTimeout(() => resolve(adminMockBooks.find(b => b.id === id)), 100));
}

async function saveAdminBook(bookData: Book, lang: string, router: ReturnType<typeof useRouter>): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      const index = adminMockBooks.findIndex(b => b.id === bookData.id);
      if (index !== -1) {
        adminMockBooks[index] = bookData; 
      } else {
        adminMockBooks.unshift({ ...bookData, id: String(Date.now()) }); 
      }
      router.push(`/${lang}/admin/books`); // Use router with lang
      resolve();
    }, 300);
  });
}

async function deleteAdminBook(bookId: string, lang: string, router: ReturnType<typeof useRouter>): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      adminMockBooks = adminMockBooks.filter(b => b.id !== bookId);
      router.push(`/${lang}/admin/books`); // Use router with lang
      resolve();
    }, 300);
  });
}

interface ManageBooksContentProps {
  params: { lang: string };
}

function ManageBooksContent({ params: { lang } }: ManageBooksContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize router
  const action = searchParams.get('action');
  const bookId = searchParams.get('id');

  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [keyForForm, setKeyForForm] = useState(Date.now()); 

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const fetchedBooks = await getAdminBooks();
      setBooks(fetchedBooks);
      if (action === 'edit' && bookId) {
        const bookToEdit = await getAdminBookById(bookId);
        setEditingBook(bookToEdit);
      } else {
        setEditingBook(undefined); 
      }
      setIsLoading(false);
      setKeyForForm(Date.now()); 
    }
    loadData();
  }, [action, bookId, lang]); // Added lang to dependency array

  const handleSaveBook = (bookData: Book) => saveAdminBook(bookData, lang, router);
  const handleDeleteBook = (id: string) => deleteAdminBook(id, lang, router);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (action === 'add' || (action === 'edit' && bookId)) {
    return <BookFormClient key={keyForForm} book={editingBook} onSave={handleSaveBook} onDelete={handleDeleteBook} lang={lang} />;
  }

  return <BookListClient initialBooks={books} onDeleteBook={handleDeleteBook} lang={lang} />;
}

interface ManageBooksPageProps {
  params: { lang: string };
}

export default function ManageBooksPage({ params }: ManageBooksPageProps) {
  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold text-primary">Manage Books</h1>
      <Suspense fallback={<div className="flex justify-center items-center min-h-[300px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <ManageBooksContent params={params} />
      </Suspense>
    </div>
  );
}
