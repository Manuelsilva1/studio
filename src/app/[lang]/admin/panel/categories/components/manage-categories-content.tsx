
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
  params: { lang?: string };
  initialCategories: Category[];
  texts: any; // Dictionary texts for categories
}

export function ManageCategoriesContent({ params, initialCategories, texts }: ManageCategoriesContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  let derivedLang = 'en'; 
  if (params && typeof params.lang === 'string' && params.lang.trim() !== '') {
    derivedLang = params.lang;
  } else if (pathname) {
    const segments = pathname.split('/');
    if (segments.length > 1 && (segments[1] === 'en' || segments[1] === 'es')) {
      derivedLang = segments[1];
    }
  }
  const lang = derivedLang;

  const action = searchParams.get('action');
  const categoryId = searchParams.get('id');

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [keyForForm, setKeyForForm] = useState(Date.now());

  useEffect(() => {
    setCategories(initialCategories); // Initialize with fetched data
    if (action === 'edit' && categoryId) {
      setIsLoading(true);
      getCategoryById(categoryId).then(categoryToEdit => {
        setEditingCategory(categoryToEdit);
        setIsLoading(false);
        setKeyForForm(Date.now());
      }).catch(error => {
        console.error("Error fetching category for editing:", error);
        setIsLoading(false);
        setEditingCategory(undefined);
        toast({ title: texts.toastError, description: "Failed to load category for editing.", variant: "destructive" });
      });
    } else {
      setEditingCategory(undefined);
      setKeyForForm(Date.now());
    }
  }, [action, categoryId, initialCategories, lang, toast, texts.toastError]);

  const refreshCategories = async () => {
    setIsLoading(true);
    try {
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
    } catch (error) {
      toast({ title: texts.toastError, description: "Failed to refresh categories.", variant: "destructive" });
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
       if (error.message === "DUPLICATE_CATEGORY_NAME") {
        toast({ title: texts.toastError, description: texts.errorDuplicateName, variant: "destructive" });
      } else {
        toast({ title: texts.toastError, description: "Could not save category.", variant: "destructive" });
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
       toast({ title: texts.toastError, description: "Could not delete category.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };
  

  if (isLoading && (action === 'edit' && categoryId || !action)) { // Show loader when loading list or edit form
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
    if (editingCategory) {
      return <CategoryFormClient
                key={keyForForm}
                category={editingCategory}
                onSave={handleSaveCategory}
                onDelete={handleDeleteCategory}
                lang={lang}
                texts={texts}
              />;
    } else if (!isLoading) { // Was loading, but now finished and no category found
      return <div className="text-center py-10 text-muted-foreground">Category not found or failed to load.</div>;
    }
     // Still loading the edit form specifically
    return <div className="flex justify-center items-center min-h-[300px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return <CategoryListClient
            initialCategories={categories}
            onDeleteCategory={handleDeleteCategory}
            lang={lang}
            texts={texts}
          />;
}
