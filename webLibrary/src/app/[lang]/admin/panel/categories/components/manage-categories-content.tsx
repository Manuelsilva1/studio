
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Category } from '@/types';
import { getCategoryById, saveCategory, deleteCategory, getCategories } from '@/lib/mock-data';
import { CategoryFormClient } from './category-form-client';
import { CategoryListClient } from './category-list-client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ManageCategoriesContentProps {
  params: { lang: string }; // lang is now string, not string | undefined
  initialCategories: Category[];
  texts: any; // Dictionary texts for categories
}

export function ManageCategoriesContent({ params, initialCategories, texts }: ManageCategoriesContentProps) {
  const router = useRouter();
  const pathname = usePathname(); // Retained for potential future use, but lang is primary
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const lang = params.lang; // Directly use lang from params

  const action = searchParams.get('action');
  const categoryId = searchParams.get('id');

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false); // Initialize to false
  const [keyForForm, setKeyForForm] = useState(Date.now());

  useEffect(() => {
    setCategories(initialCategories); 
    let shouldLoadSpecificCategory = action === 'edit' && categoryId;

    if (shouldLoadSpecificCategory) {
      setIsLoading(true);
      getCategoryById(categoryId as string).then(categoryToEdit => {
        setEditingCategory(categoryToEdit);
        setIsLoading(false);
        setKeyForForm(Date.now());
      }).catch(error => {
        console.error("Error fetching category for editing:", error);
        setIsLoading(false);
        setEditingCategory(undefined);
        // Ensure texts and toastError exist before calling toast
        if (texts && texts.toastError) {
            toast({ title: texts.toastError, description: "Failed to load category for editing.", variant: "destructive" });
        } else {
            console.error("Dictionary texts for toast not available.");
        }
      });
    } else {
      setEditingCategory(undefined);
      setKeyForForm(Date.now());
      // if action is 'add' or viewing list, ensure isLoading is false if not already loading something else.
      if (action === 'add' || !action) {
        setIsLoading(false);
      }
    }
  }, [action, categoryId, initialCategories, lang, toast, texts]); // Removed texts.toastError from deps, texts is enough

  const refreshCategories = async () => {
    setIsLoading(true);
    try {
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
    } catch (error) {
      if (texts && texts.toastError) {
        toast({ title: texts.toastError, description: "Failed to refresh categories.", variant: "destructive" });
      } else {
        console.error("Dictionary texts for toast not available.");
      }
    }
    setIsLoading(false);
  };


  const handleSaveCategory = async (data: Category) => {
    setIsLoading(true);
    try {
      await saveCategory(data);
      await refreshCategories(); 
      router.push(`/${lang}/admin/panel/categories`);
    } catch (error: any) {
      let errorDesc = "Could not save category.";
      if (error.message === "DUPLICATE_CATEGORY_NAME" && texts && texts.errorDuplicateName) {
        errorDesc = texts.errorDuplicateName;
      }
      if (texts && texts.toastError) {
        toast({ title: texts.toastError, description: errorDesc, variant: "destructive" });
      } else {
        console.error("Dictionary texts for toast not available. Save error:", errorDesc);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteCategory(id);
      await refreshCategories();
      router.push(`/${lang}/admin/panel/categories`);
    } catch (error) {
       if (texts && texts.toastError) {
        toast({ title: texts.toastError, description: "Could not delete category.", variant: "destructive" });
       } else {
        console.error("Dictionary texts for toast not available.");
       }
    } finally {
        setIsLoading(false);
    }
  };
  

  // Adjusted loading condition: show loader if isLoading is true AND (it's an edit action OR no action (list view trying to load/refresh))
  if (isLoading && ( (action === 'edit' && categoryId) || !action) ) { 
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (action === 'add') {
    return <CategoryFormClient
              key={keyForForm}
              category={undefined}
              onSave={handleSaveCategory}
              onDelete={undefined}
              lang={lang}
              texts={texts}
            />;
  }

  if (action === 'edit' && categoryId) {
    // If still loading specifically for the edit form after the initial check
    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[300px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }
    if (editingCategory) {
      return <CategoryFormClient
                key={keyForForm}
                category={editingCategory}
                onSave={handleSaveCategory}
                onDelete={handleDeleteCategory}
                lang={lang}
                texts={texts}
              />;
    } else { // No longer loading, but no category found for editing
      return <div className="text-center py-10 text-muted-foreground">Category not found or failed to load.</div>;
    }
  }

  // Default to list view
  return <CategoryListClient
            initialCategories={categories}
            onDeleteCategory={handleDeleteCategory}
            lang={lang}
            texts={texts}
          />;
}

