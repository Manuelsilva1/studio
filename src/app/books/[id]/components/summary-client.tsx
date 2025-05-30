"use client";

import { useState } from 'react';
import type { Book } from '@/types';
import { generateBookSummary, type BookSummaryInput } from '@/ai/flows/book-summary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SummaryClientProps {
  book: Book;
}

export function SummaryClient({ book }: SummaryClientProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    if (!book.content) {
      toast({
        title: "Summary Error",
        description: "No content available to summarize for this book.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setSummary(null);
    try {
      const input: BookSummaryInput = { bookContent: book.content };
      const result = await generateBookSummary(input);
      setSummary(result.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Summary Generation Failed",
        description: "Could not generate summary at this time. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-primary" /> AI Generated Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!summary && !isLoading && (
           <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Want a quick overview? Generate an AI summary of this book.</p>
            <Button onClick={handleGenerateSummary} disabled={isLoading || !book.content}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Summary
            </Button>
            {!book.content && <p className="text-xs text-destructive mt-2">Summary content not available for this book.</p>}
          </div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Generating summary...</p>
          </div>
        )}
        {summary && !isLoading && (
          <div className="space-y-4">
            <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{summary}</p>
            <Button onClick={handleGenerateSummary} variant="outline" size="sm" disabled={isLoading || !book.content}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Regenerate Summary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
