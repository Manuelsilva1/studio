
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Editorial } from '@/types';
import { getEditorialById, saveEditorial, deleteEditorial } from '@/lib/mock-data';
import { EditorialFormClient } from './editorial-form-client';
import { EditorialListClient } from './editorial-list-client';
import { Loader2 } from 'lucide-react';

interface ManageEditorialsContentProps {
  params: { lang: string };
  initialEditorials: Editorial[];
  texts: any;
}

export function ManageEditorialsContent({ params, initialEditorials, texts }: ManageEditorialsContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
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
  }, [action, editorialId, initialEditorials, params.lang]); // Use params.lang in dependency array

  const handleSaveEditorial = async (data: Editorial) => {
    setIsLoading(true);
    await saveEditorial(data);
    router.push(`/${params.lang}/admin/panel/editorials`);
  };

  const handleDeleteEditorial = async (id: string) => {
    await deleteEditorial(id);
    router.push(`/${params.lang}/admin/panel/editorials`);
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
              lang={params.lang} // Pass params.lang directly
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
                lang={params.lang} // Pass params.lang directly
                texts={texts}
              />;
    } else if (!isLoading) {
      return <div className="text-center py-10 text-muted-foreground">Editorial not found or failed to load.</div>;
    }
    return <div className="flex justify-center items-center min-h-[300px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return <EditorialListClient
            initialEditorials={editorials}
            onDeleteEditorial={handleDeleteEditorial}
            lang={params.lang} // Pass params.lang directly
            texts={texts}
          />;
}
