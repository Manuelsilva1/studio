
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import { mockBooks } from '@/lib/mock-data'; // Using mock data
import type { Book } from '@/types';
import { PosClient } from './components/pos-client';

interface AdminPosPageProps {
  params: {
    lang: string;
  };
}

export default async function AdminPosPage({ params: { lang } }: AdminPosPageProps) {
  const dictionary = await getDictionary(lang);
  const texts = dictionary.adminPanel?.posPage || {
    title: "Point of Sale",
    // Add other default texts if needed
  };
  
  // Fetch all books (mock data for now)
  const books: Book[] = [...mockBooks];

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold text-primary">{texts.title}</h1>
      <PosClient 
        lang={lang} 
        dictionary={dictionary} 
        allBooks={books} 
        posTexts={texts} 
      />
    </div>
  );
}
