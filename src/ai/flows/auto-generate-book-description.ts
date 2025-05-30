'use server';
/**
 * @fileOverview AI agent to generate book descriptions for the admin dashboard.
 *
 * - generateBookDescription - A function that generates a book description.
 * - GenerateBookDescriptionInput - The input type for the generateBookDescription function.
 * - GenerateBookDescriptionOutput - The return type for the generateBookDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  genre: z.string().describe('The genre of the book.'),
  targetAudience: z.string().describe('Intended audience, e.g., children, young adults, adults.'),
  themes: z.string().describe('Themes explored in the book, comma separated.'),
});
export type GenerateBookDescriptionInput = z.infer<typeof GenerateBookDescriptionInputSchema>;

const GenerateBookDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated book description.'),
});
export type GenerateBookDescriptionOutput = z.infer<typeof GenerateBookDescriptionOutputSchema>;

export async function generateBookDescription(
  input: GenerateBookDescriptionInput
): Promise<GenerateBookDescriptionOutput> {
  return generateBookDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBookDescriptionPrompt',
  input: {schema: GenerateBookDescriptionInputSchema},
  output: {schema: GenerateBookDescriptionOutputSchema},
  prompt: `You are a creative content writer specializing in book descriptions.

  Based on the following book details, generate a compelling and engaging description suitable for publishing on an online bookstore. The description should be approximately 150-200 words.

  Title: {{{title}}}
  Author: {{{author}}}
  Genre: {{{genre}}}
  Target Audience: {{{targetAudience}}}
  Themes: {{{themes}}}

  Description:`,
});

const generateBookDescriptionFlow = ai.defineFlow(
  {
    name: 'generateBookDescriptionFlow',
    inputSchema: GenerateBookDescriptionInputSchema,
    outputSchema: GenerateBookDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
