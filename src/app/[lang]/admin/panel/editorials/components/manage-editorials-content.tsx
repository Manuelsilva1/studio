
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'; // Added usePathname
import type { Editorial } from '@/types';
import { getEditorialById, saveEditorial, deleteEditorial } from '@/lib/mock-data';
import { EditorialFormClient } from './editorial-form-client';
import { EditorialListClient } from './editorial-list-client';
import { Loader2 } from 'lucide-react';

interface ManageEditorialsContentProps {
  params: { lang?: string }; // Made lang potentially optional to handle if it's unexpectedly missing
  initialEditorials: Editorial[];
  texts: any;
}

export function ManageEditorialsContent({ params, initialEditorials, texts }: ManageEditorialsContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Robust lang derivation
  let derivedLang = 'en'; // Default to 'en'
  if (params && typeof params.lang === 'string' && params.lang.trim() !== '') {
    derivedLang = params.lang;
  } else if (pathname) {
    const segments = pathname.split('/');
    // segments[0] is empty string, segments[1] is lang
    if (segments.length > 1 && (segments[1] === 'en' || segments[1] === 'es')) {
      derivedLang = segments[1];
    }
  }
  const lang = derivedLang; // Use this 'lang' variable consistently

  const action = searchParams.get('action');
  const editorialId = searchParams.get('id');

  const [editorials, setEditorials] = useState<Editorial[]>(initialEditorials);
  const [editingEditorial, setEditingEditorial] = useState<Editorial | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [keyForForm, setKeyForForm] = useState(Date.now());

  useEffect(() => {
    setEditorials(initialEditorials);
    if (action === 'edit' && editorialId) {
      setIsLoading(true);
      getEditorialById(editorialId).then(editorialToEdit => {
        setEditingEditorial(editorialToEdit);
        setIsLoading(false);
        setKeyForForm(Date.now());
      }).catch(error => {
        console.error("Error fetching editorial for editing:", error);
        setIsLoading(false);
        setEditingEditorial(undefined);
      });
    } else {
      setEditingEditorial(undefined);
      setKeyForForm(Date.now());
    }
  }, [action, editorialId, initialEditorials, lang]); // Use the derived lang in dependency array

  const handleSaveEditorial = async (data: Editorial) => {
    setIsLoading(true);
    await saveEditorial(data);
    router.push(`/${lang}/admin/panel/editorials`); // Use derived lang
  };

  const handleDeleteEditorial = async (id: string) => {
    await deleteEditorial(id);
    router.push(`/${lang}/admin/panel/editorials`); // Use derived lang
  };

  if (isLoading && action === 'edit' && editorialId) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (action === 'add') {
    return <EditorialFormClient
              key={keyForForm}
              editorial={undefined}
              onSave={handleSaveEditorial}
              onDelete={undefined}
              lang={lang} // Pass derived lang
              texts={texts}
            />;
  }

  if (action === 'edit' && editorialId) {
    if (editingEditorial) {
      return <EditorialFormClient
                key={keyForForm}
                editorial={editingEditorial}
                onSave={handleSaveEditorial}
                onDelete={handleDeleteEditorial}
                lang={lang} // Pass derived lang
                texts={texts}
              />;
    } else if (!isLoading) {
      return <div className="text-center py-10 text-muted-foreground">Editorial not found or failed to load.</div>;
    }
    // Show loader while an edit is being loaded but editingEditorial is not yet set
    return <div className="flex justify-center items-center min-h-[300px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return <EditorialListClient
            initialEditorials={editorials}
            onDeleteEditorial={handleDeleteEditorial}
            lang={lang} // Pass derived lang
            texts={texts}
          />;
}
