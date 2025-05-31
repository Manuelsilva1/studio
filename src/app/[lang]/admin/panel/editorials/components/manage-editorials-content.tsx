
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
  texts: any; // Using 'any' for texts prop from parent dictionary for simplicity here
}

export function ManageEditorialsContent({ params: { lang }, initialEditorials, texts }: ManageEditorialsContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = searchParams.get('action');
  const editorialId = searchParams.get('id');

  const [editorials, setEditorials] = useState<Editorial[]>(initialEditorials);
  const [editingEditorial, setEditingEditorial] = useState<Editorial | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false); // For edit form loading specifically
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
      setKeyForForm(Date.now()); // Reset form key if not editing
    }
  }, [action, editorialId, initialEditorials, lang]); // Added lang

  const handleSaveEditorial = async (data: Editorial) => {
    setIsLoading(true); // Show loading on form save/submit
    await saveEditorial(data);
    router.push(`/${lang}/admin/panel/editorials`); // Navigate back to list, which will re-fetch
    // No need to setIsLoading(false) here as the component will unmount or re-render due to navigation
  };

  const handleDeleteEditorial = async (id: string) => {
    // setIsLoading(true); // List client handles its own loading/toast for delete confirmation
    await deleteEditorial(id);
    // To refresh the list, navigate. The list will re-fetch via its parent page.
    // A more optimistic update would be to filter 'editorials' state here, but navigation
    // ensures fresh data from the "source of truth".
    router.push(`/${lang}/admin/panel/editorials`);
  };

  if (isLoading && action === 'edit' && editorialId) { // This loader is for when fetching an editorial for the edit form
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
              onDelete={undefined} // No delete for 'add'
              lang={lang}
              texts={texts}
            />;
  }

  if (action === 'edit' && editorialId) {
    if (editingEditorial) {
      return <EditorialFormClient
                key={keyForForm}
                editorial={editingEditorial}
                onSave={handleSaveEditorial}
                onDelete={handleDeleteEditorial} // Pass delete handler for edit form
                lang={lang}
                texts={texts}
              />;
    } else if (!isLoading) { // Only show "not found" if not actively loading
      return <div className="text-center py-10 text-muted-foreground">Editorial not found or failed to load.</div>;
    }
    // Fallback to loader if in 'edit' mode but editorial is not yet loaded and not in error state
    return <div className="flex justify-center items-center min-h-[300px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return <EditorialListClient
            initialEditorials={editorials} // Use the state variable that's updated from props
            onDeleteEditorial={handleDeleteEditorial}
            lang={lang}
            texts={texts}
          />;
}
