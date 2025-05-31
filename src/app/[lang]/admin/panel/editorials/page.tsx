
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Editorial, Dictionary } from '@/types'; // Updated import for Dictionary
import { getEditorials, getEditorialById, saveEditorial, deleteEditorial } from '@/lib/mock-data';
import { EditorialFormClient } from './components/editorial-form-client';
import { EditorialListClient } from './components/editorial-list-client';
import { Loader2 } from 'lucide-react';
import { getDictionary } from '@/lib/dictionaries'; // For initial dictionary fetch

interface ManageEditorialsContentProps {
  params: { lang: string };
  initialEditorials: Editorial[];
  texts: any;
}

function ManageEditorialsContent({ params: { lang }, initialEditorials, texts }: ManageEditorialsContentProps) {
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
  }, [action, editorialId, initialEditorials, lang]);

  const handleSaveEditorial = async (data: Editorial) => {
    await saveEditorial(data);
    const updatedEditorials = await getEditorials();
    setEditorials(updatedEditorials);
    router.push(`/${lang}/admin/panel/editorials`);
  };

  const handleDeleteEditorial = async (id: string) => {
    await deleteEditorial(id);
    const updatedEditorials = await getEditorials();
    setEditorials(updatedEditorials);
    router.push(`/${lang}/admin/panel/editorials`);
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
              onDelete={handleDeleteEditorial}
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
                onDelete={handleDeleteEditorial}
                lang={lang}
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
            lang={lang}
            texts={texts}
          />;
}

interface ManageEditorialsPageProps {
  params: { lang: string };
}

export default async function ManageEditorialsPage({ params }: ManageEditorialsPageProps) {
  const dictionary: Dictionary = await getDictionary(params.lang); // Ensure type
  const editorialTexts = dictionary.adminPanel?.editorialsPage || {
    title: "Manage Publishers",
    addNewEditorial: "Add New Publisher",
    editEditorial: "Edit Publisher",
    editorialNameLabel: "Publisher Name",
    editorialNamePlaceholder: "e.g., Penguin Books",
    contactPersonLabel: "Contact Person (Optional)",
    contactPersonPlaceholder: "e.g., John Doe",
    emailLabel: "Email (Optional)",
    emailPlaceholder: "e.g., contact@publisher.com",
    phoneLabel: "Phone (Optional)",
    phonePlaceholder: "e.g., 555-123-4567",
    addressLabel: "Address (Optional)",
    addressPlaceholder: "e.g., 123 Publishing St, City",
    notesLabel: "Notes (Optional)",
    notesPlaceholder: "Any relevant notes...",
    deleteConfirmationTitle: "Are you sure?",
    deleteConfirmationMessage: "This will permanently delete the publisher \"{name}\". This action cannot be undone.",
    deleteButton: "Delete Publisher",
    cancelButton: "Cancel",
    saveButton: "Save Publisher",
    addButton: "Add Publisher",
    noEditorialsFound: "No publishers found.",
    tableHeaderName: "Name",
    tableHeaderContact: "Contact Person",
    tableHeaderEmail: "Email",
    tableHeaderActions: "Actions",
    toastEditorialSaved: "Publisher Saved!",
    toastEditorialDeleted: "Publisher Deleted!",
    toastError: "An error occurred"
  };
  const initialEditorialsData = await getEditorials();

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold text-primary">{editorialTexts.title || "Manage Publishers"}</h1>
      <Suspense fallback={<div className="flex justify-center items-center min-h-[300px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <ManageEditorialsContent
            params={params}
            initialEditorials={initialEditorialsData || []}
            texts={editorialTexts}
        />
      </Suspense>
    </div>
  );
}
