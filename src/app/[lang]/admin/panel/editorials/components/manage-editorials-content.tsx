
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Editorial } from '@/types';
import { getEditorialById, saveEditorial, deleteEditorial, getEditorials } from '@/lib/mock-data'; // Added getEditorials
import { EditorialFormClient } from './editorial-form-client';
import { EditorialListClient } from './editorial-list-client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Added useToast

interface ManageEditorialsContentProps {
  params: { lang: string }; // Changed lang to be a required string
  initialEditorials: Editorial[];
  texts: any;
}

export function ManageEditorialsContent({ params, initialEditorials, texts }: ManageEditorialsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast(); // Initialized useToast

  const lang = params.lang; // Directly use lang from params

  const action = searchParams.get('action');
  const editorialId = searchParams.get('id');

  const [editorials, setEditorials] = useState<Editorial[]>(initialEditorials);
  const [editingEditorial, setEditingEditorial] = useState<Editorial | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [keyForForm, setKeyForForm] = useState(Date.now());

  useEffect(() => {
    // Function to refresh editorials list
    const refreshEditorials = async () => {
      setIsLoading(true);
      try {
        const updatedEditorials = await getEditorials();
        setEditorials(updatedEditorials);
      } catch (error) {
        if (texts && texts.toastError) {
          toast({ title: texts.toastError, description: "Failed to refresh publishers.", variant: "destructive" });
        } else {
          console.error("Dictionary texts for toast not available for refreshing publishers.");
        }
      }
      setIsLoading(false);
    };
    
    // Set initial editorials and then decide if specific actions are needed
    setEditorials(initialEditorials);
    let shouldLoadSpecificEditorial = action === 'edit' && editorialId;

    if (shouldLoadSpecificEditorial) {
      setIsLoading(true);
      getEditorialById(editorialId as string).then(editorialToEdit => {
        setEditingEditorial(editorialToEdit);
        setIsLoading(false);
        setKeyForForm(Date.now());
      }).catch(error => {
        console.error("Error fetching editorial for editing:", error);
        setIsLoading(false);
        setEditingEditorial(undefined);
        if (texts && texts.toastError) {
            toast({ title: texts.toastError, description: "Failed to load publisher for editing.", variant: "destructive" });
        } else {
            console.error("Dictionary texts for toast not available for loading editorial.");
        }
      });
    } else {
      setEditingEditorial(undefined);
      setKeyForForm(Date.now());
      // If action is 'add' or viewing list, ensure isLoading reflects this if we aren't loading/refreshing.
      // If initialEditorials were passed, list is already "loaded" unless a refresh is triggered.
      if (action === 'add' || !action) {
         // Potentially call refreshEditorials here if initial data might be stale or if it's the first load after action
        if (!initialEditorials || initialEditorials.length === 0 || (action === 'add' && !editorialId)) {
            // Only refresh if there are no initial editorials or it's an add action without an id
            // refreshEditorials(); // This might be too aggressive on every render.
        } else {
            setIsLoading(false); // Data is assumed to be fresh from props
        }
      }
    }
  }, [action, editorialId, initialEditorials, lang, toast, texts]);


  const handleSaveEditorial = async (data: Editorial) => {
    setIsLoading(true);
    try {
      await saveEditorial(data);
      // Instead of router.push, which was causing a full page reload and re-fetching initial props,
      // we will fetch the updated list and reset the URL query params.
      const updatedEditorials = await getEditorials();
      setEditorials(updatedEditorials);
      router.push(`/${lang}/admin/panel/editorials`, { scroll: false }); // Navigate without query params, avoid full reload
      // Toast is now handled in EditorialFormClient after successful save for immediate feedback
    } catch (error: any) {
        let errorDesc = texts.toastErrorEditorialSave || "Could not save publisher.";
        // Add specific error handling if saveEditorial throws typed errors
        if (texts && texts.toastError) {
          toast({ title: texts.toastError, description: errorDesc, variant: "destructive" });
        } else {
          console.error("Dictionary texts for toast not available. Save error:", errorDesc);
        }
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteEditorial = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteEditorial(id);
      // Similar to save, refresh list and reset URL
      const updatedEditorials = await getEditorials();
      setEditorials(updatedEditorials);
      router.push(`/${lang}/admin/panel/editorials`, { scroll: false });
      // Toast handled in EditorialFormClient or list component after confirmation
    } catch (error) {
       if (texts && texts.toastError) {
        toast({ title: texts.toastError, description: texts.toastErrorEditorialDelete || "Could not delete publisher.", variant: "destructive" });
       } else {
        console.error("Dictionary texts for toast not available for deleting publisher.");
       }
    } finally {
        setIsLoading(false);
    }
  };
  
  if (isLoading && ( (action === 'edit' && editorialId) || (!action && editorials.length === 0) ) ) { 
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
              lang={lang}
              texts={texts}
            />;
  }

  if (action === 'edit' && editorialId) {
    if (isLoading) { // Still loading the specific editorial
        return <div className="flex justify-center items-center min-h-[300px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }
    if (editingEditorial) {
      return <EditorialFormClient
                key={keyForForm}
                editorial={editingEditorial}
                onSave={handleSaveEditorial}
                onDelete={handleDeleteEditorial}
                lang={lang}
                texts={texts}
              />;
    } else { // No longer loading, but no editorial found for editing
      return <div className="text-center py-10 text-muted-foreground">{texts.editorialNotFound || "Publisher not found or failed to load."}</div>;
    }
  }

  // Default to list view
  return <EditorialListClient
            initialEditorials={editorials} // Pass the current state of editorials
            onDeleteEditorial={handleDeleteEditorial}
            lang={lang}
            texts={texts}
          />;
}
