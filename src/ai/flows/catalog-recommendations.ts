// src/ai/flows/catalog-recommendations.ts
'use server';

/**
 * @fileOverview AI-powered book recommendations based on catalog filters.
 *
 * - getCatalogRecommendations - A function that provides book recommendations based on user-selected filters.
 * - CatalogRecommendationsInput - The input type for the getCatalogRecommendations function.
 * - CatalogRecommendationsOutput - The return type for the getCatalogRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CatalogRecommendationsInputSchema = z.object({
  filters: z
    .string()
    .describe('The filters selected by the user, as a stringified JSON object.'),
  availableBooks: z
    .string()
    .describe('The list of available books, as a stringified JSON object.'),
});

export type CatalogRecommendationsInput = z.infer<
  typeof CatalogRecommendationsInputSchema
>;

const CatalogRecommendationsOutputSchema = z.object({
  recommendedBooks: z
    .array(z.string())
    .describe('The list of recommended book titles based on the filters.'),
});

export type CatalogRecommendationsOutput = z.infer<
  typeof CatalogRecommendationsOutputSchema
>;

export async function getCatalogRecommendations(
  input: CatalogRecommendationsInput
): Promise<CatalogRecommendationsOutput> {
  return catalogRecommendationsFlow(input);
}

const catalogRecommendationsPrompt = ai.definePrompt({
  name: 'catalogRecommendationsPrompt',
  input: {schema: CatalogRecommendationsInputSchema},
  output: {schema: CatalogRecommendationsOutputSchema},
  prompt: `You are a book recommendation expert. Based on the user's selected filters and the available books, provide a list of recommended book titles.

Filters: {{{filters}}}
Available Books: {{{availableBooks}}}

Consider the filters to dynamically determine what books the user might be interested in. Only recommend books from the list of available books.

Return ONLY a JSON object with the 'recommendedBooks' which is a list of titles from the available books.
`,
});

const catalogRecommendationsFlow = ai.defineFlow(
  {
    name: 'catalogRecommendationsFlow',
    inputSchema: CatalogRecommendationsInputSchema,
    outputSchema: CatalogRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await catalogRecommendationsPrompt(input);
    return output!;
  }
);
