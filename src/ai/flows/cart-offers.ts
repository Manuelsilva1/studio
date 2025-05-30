// CartOffers
'use server';
/**
 * @fileOverview AI assistant that suggests relevant offers or coupons based on the items in the shopping cart.
 *
 * - suggestCartOffers - A function that handles the suggestion of offers or coupons for the shopping cart.
 * - SuggestCartOffersInput - The input type for the suggestCartOffers function.
 * - SuggestCartOffersOutput - The return type for the suggestCartOffers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCartOffersInputSchema = z.object({
  cartItems: z
    .array(
      z.object({
        name: z.string().describe('Name of the item in the cart'),
        price: z.number().describe('Price of the item'),
        quantity: z.number().describe('Quantity of the item'),
      })
    )
    .describe('Items currently in the shopping cart'),
  availableOffers: z
    .array(
      z.object({
        name: z.string().describe('Name of the offer'),
        description: z.string().describe('Description of the offer'),
        couponCode: z.string().describe('Coupon code for the offer'),
        conditions: z.string().describe('Conditions for the offer'),
      })
    )
    .describe('Available offers or coupons'),
});

export type SuggestCartOffersInput = z.infer<typeof SuggestCartOffersInputSchema>;

const SuggestCartOffersOutputSchema = z.object({
  suggestedOffers: z
    .array(
      z.object({
        name: z.string().describe('Name of the suggested offer'),
        description: z.string().describe('Description of the offer'),
        couponCode: z.string().describe('Coupon code for the offer'),
      })
    )
    .describe('Offers or coupons that are relevant to the items in the cart'),
  reasoning: z.string().describe('Reasoning for suggesting these offers based on cart contents.'),
});

export type SuggestCartOffersOutput = z.infer<typeof SuggestCartOffersOutputSchema>;

export async function suggestCartOffers(input: SuggestCartOffersInput): Promise<SuggestCartOffersOutput> {
  return suggestCartOffersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCartOffersPrompt',
  input: {schema: SuggestCartOffersInputSchema},
  output: {schema: SuggestCartOffersOutputSchema},
  prompt: `You are an AI assistant helping users find relevant offers and coupons based on the items in their shopping cart.
  Given the items in the cart and a list of available offers, determine which offers are most relevant to the user.
  Explain the reasoning for your suggestions.

  Cart Items:
  {{#each cartItems}}
  - {{quantity}} x {{name}} (${{price}})
  {{/each}}

  Available Offers:
  {{#each availableOffers}}
  - Name: {{name}}
    Description: {{description}}
    Coupon Code: {{couponCode}}
    Conditions: {{conditions}}
  {{/each}}

  Based on the cart items and available offers, which offers are most relevant to the user and why?  Explain your reasoning, and then list the offers that are a good fit.
  `,
});

const suggestCartOffersFlow = ai.defineFlow(
  {
    name: 'suggestCartOffersFlow',
    inputSchema: SuggestCartOffersInputSchema,
    outputSchema: SuggestCartOffersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
