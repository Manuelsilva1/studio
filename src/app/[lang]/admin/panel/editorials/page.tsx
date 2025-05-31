
"use client"; 

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Editorial } from '@/types';
import { getEditorials, getEditorialById, saveEditorial, deleteEditorial } from '@/lib/mock-data'; 
import { EditorialFormClient } from './components/editorial-form-client';
import { EditorialListClient } from './components/editorial-list-client';
import { Loader2 } from 'lucide-react';
import { getDictionary } from '@/lib/dictionaries'; // Import getDictionary for server-side fetching initially

interface ManageEditorialsContentProps {
  params: { lang: string };
  initialEditorials: Editorial[];
  texts: any; // Texts for editorials page
}

function ManageEditorialsContent({ params: { lang }, initialEditorials, texts }: ManageEditorialsContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = searchParams.get('action');
  const editorialId = searchParams.get('id');

  const [editorials, setEditorials] = useState<Editorial[]>(initialEditorials);
  const [editingEditorial, setEditingEditorial] = useState<Editorial | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false); // Changed initial to false as data is pre-fetched
  const [keyForForm, setKeyForForm] = useState(Date.now()); 

  useEffect(() => {
    setEditorials(initialEditorials); // Set from prop
    if (action === 'edit' && editorialId) {
      setIsLoading(true);
      getEditorialById(editorialId).then(editorialToEdit => {
        setEditingEditorial(editorialToEdit);
        setIsLoading(false);
        setKeyForForm(Date.now());
      });
    } else {
      setEditingEditorial(undefined); 
      setKeyForForm(Date.now());
    }
  }, [action, editorialId, initialEditorials, lang]);

  const handleSaveEditorial = async (data: Editorial) => {
    await saveEditorial(data);
    const updatedEditorials = await getEditorials(); // Re-fetch after save
    setEditorials(updatedEditorials);
    router.push(`/${lang}/admin/panel/editorials`); 
  };

  const handleDeleteEditorial = async (id: string) => {
    await deleteEditorial(id);
    const updatedEditorials = await getEditorials(); // Re-fetch after delete
    setEditorials(updatedEditorials);
    router.push(`/${lang}/admin/panel/editorials`);
  };

  if (isLoading && (action === 'edit' && editorialId)) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (action === 'add' || (action === 'edit' && editorialId)) {
    return <EditorialFormClient 
              key={keyForForm} 
              editorial={editingEditorial} 
              onSave={handleSaveEditorial} 
              onDelete={handleDeleteEditorial} 
              lang={lang} 
              texts={texts}
            />;
  }

  return <EditorialListClient 
            initialEditorials={editorials} 
            onDeleteEditorial={handleDeleteEditorial} 
            lang={lang} 
            texts={texts} 
          />;
}

interface ManageEditorialsPageProps {
  params: { lang: string };
}

// This outer component is now a Server Component to fetch initial data
export default async function ManageEditorialsPage({ params }: ManageEditorialsPageProps) {
  const dictionary = await getDictionary(params.lang);
  const editorialTexts = dictionary.adminPanel?.editorialsPage || { title: "Manage Publishers" };
  const initialEditorialsData = await getEditorials();

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold text-primary">{editorialTexts.title}</h1>
      <Suspense fallback={<div className="flex justify-center items-center min-h-[300px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        {/* ManageEditorialsContent is now passed initial data */}
        <ManageEditorialsContent params={params} initialEditorials={initialEditorialsData} texts={editorialTexts} />
      </Suspense>
    </div>
  );
}
