'use server';

/**
 * @fileOverview Generates a summary of a book.
 *
 * - generateBookSummary - A function that generates a book summary.
 * - BookSummaryInput - The input type for the generateBookSummary function.
 * - BookSummaryOutput - The return type for the generateBookSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BookSummaryInputSchema = z.object({
  bookContent: z.string().describe('The content of the book to summarize.'),
});
export type BookSummaryInput = z.infer<typeof BookSummaryInputSchema>;

const BookSummaryOutputSchema = z.object({
  summary: z.string().describe('A short summary of the book content.'),
});
export type BookSummaryOutput = z.infer<typeof BookSummaryOutputSchema>;

export async function generateBookSummary(input: BookSummaryInput): Promise<BookSummaryOutput> {
  return bookSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bookSummaryPrompt',
  input: {schema: BookSummaryInputSchema},
  output: {schema: BookSummaryOutputSchema},
  prompt: `You are an expert book summarizer. Please provide a concise summary of the following book content:\n\n{{{bookContent}}}`,
});

const bookSummaryFlow = ai.defineFlow(
  {
    name: 'bookSummaryFlow',
    inputSchema: BookSummaryInputSchema,
    outputSchema: BookSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
