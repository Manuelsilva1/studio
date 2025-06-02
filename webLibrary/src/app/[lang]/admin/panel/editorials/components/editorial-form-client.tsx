
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Editorial } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const editorialSchema = z.object({
  name: z.string().min(2, "Publisher name must be at least 2 characters"),
  contactPerson: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type EditorialFormData = z.infer<typeof editorialSchema>;

interface EditorialFormClientProps {
  editorial?: Editorial;
  onSave: (data: Editorial) => Promise<void>; 
  onDelete?: (editorialId: string) => Promise<void>;
  lang: string; 
  texts: any; // Dictionary texts for editorials
}

export function EditorialFormClient({ editorial, onSave, onDelete, lang, texts }: EditorialFormClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<EditorialFormData>({
    resolver: zodResolver(editorialSchema),
    defaultValues: editorial || {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    },
  });
  
  useEffect(() => {
    if(editorial) {
      form.reset(editorial);
    }
  }, [editorial, form]);

  const onSubmitHandler: SubmitHandler<EditorialFormData> = async (data) => {
    setIsSaving(true);
    try {
      const editorialToSave: Editorial = {
        id: editorial?.id || `editorial_${Date.now()}`, // Create new ID if not editing
        ...data,
      };
      await onSave(editorialToSave);
      toast({
        title: texts.toastEditorialSaved || "Publisher Saved!",
        description: `${data.name} has been successfully saved.`,
      });
      // Navigation handled by parent page which reloads data or redirects
    } catch (error) {
      console.error("Error saving publisher:", error);
      toast({
        title: texts.toastError || "Save Failed",
        description: "Could not save publisher. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (editorial && onDelete) {
      setIsSaving(true);
      try {
        await onDelete(editorial.id);
        toast({
          title: texts.toastEditorialDeleted || "Publisher Deleted",
          description: `${editorial.name} has been deleted.`,
        });
        // Navigation handled by parent page
      } catch (error) {
        toast({
          title: texts.toastError || "Delete Failed",
          description: "Could not delete publisher.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">{editorial ? texts.editEditorial : texts.addNewEditorial}</CardTitle>
            <CardDescription>{/* Add a description if needed */}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>{texts.editorialNameLabel}</FormLabel>
                <FormControl><Input placeholder={texts.editorialNamePlaceholder} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="contactPerson" render={({ field }) => (
                <FormItem>
                  <FormLabel>{texts.contactPersonLabel}</FormLabel>
                  <FormControl><Input placeholder={texts.contactPersonPlaceholder} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>{texts.emailLabel}</FormLabel>
                  <FormControl><Input type="email" placeholder={texts.emailPlaceholder} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>{texts.phoneLabel}</FormLabel>
                <FormControl><Input placeholder={texts.phonePlaceholder} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>{texts.addressLabel}</FormLabel>
                <FormControl><Textarea placeholder={texts.addressPlaceholder} {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>{texts.notesLabel}</FormLabel>
                <FormControl><Textarea placeholder={texts.notesPlaceholder} {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button type="submit" size="lg" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              {editorial ? texts.saveButton : texts.addButton}
            </Button>
            {editorial && onDelete && (
              <Button type="button" variant="destructive" size="lg" onClick={handleDelete} disabled={isSaving}>
                <Trash2 className="mr-2 h-5 w-5" /> {texts.deleteButton}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
