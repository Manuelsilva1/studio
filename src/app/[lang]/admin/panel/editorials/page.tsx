
// No "use client" here, this is a Server Component
import { Suspense } from 'react';
import type { Dictionary } from '@/types';
import { getEditorials } from '@/lib/mock-data';
import { getDictionary } from '@/lib/dictionaries';
import { Loader2 } from 'lucide-react';
import { ManageEditorialsContent } from './components/manage-editorials-content'; // Import the new client component

interface ManageEditorialsPageProps {
  params: { lang: string };
}

export default async function ManageEditorialsPage({ params }: ManageEditorialsPageProps) {
  const dictionary: Dictionary = await getDictionary(params.lang);
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
