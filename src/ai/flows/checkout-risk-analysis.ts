// src/ai/flows/checkout-risk-analysis.ts
'use server';

/**
 * @fileOverview Analyzes checkout information for potential risks and missing data.
 *
 * - checkoutRiskAnalysis - A function that analyzes checkout data and identifies potential issues.
 * - CheckoutRiskAnalysisInput - The input type for the checkoutRiskAnalysis function.
 * - CheckoutRiskAnalysisOutput - The return type for the checkoutRiskAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckoutRiskAnalysisInputSchema = z.object({
  name: z.string().describe('The full name of the customer.'),
  email: z.string().email().describe('The email address of the customer.'),
  address: z.string().describe('The full street address of the customer.'),
  city: z.string().describe('The city of the customer.'),
  state: z.string().describe('The state of the customer.'),
  zip: z.string().describe('The zip code of the customer.'),
  paymentMethod: z.string().describe('The payment method used by the customer (e.g., credit card, PayPal).'),
  cartContents: z.string().describe('A description of the items in the shopping cart.'),
});
export type CheckoutRiskAnalysisInput = z.infer<typeof CheckoutRiskAnalysisInputSchema>;

const CheckoutRiskAnalysisOutputSchema = z.object({
  missingFields: z.array(z.string()).describe('A list of missing fields that should be provided by the user.'),
  potentialIssues: z
    .array(z.string())
    .describe('A list of potential issues or inconsistencies in the provided information.'),
  riskAssessment: z
    .string()
    .describe('A summary of the risk assessment based on the provided information.'),
});
export type CheckoutRiskAnalysisOutput = z.infer<typeof CheckoutRiskAnalysisOutputSchema>;

export async function checkoutRiskAnalysis(input: CheckoutRiskAnalysisInput): Promise<CheckoutRiskAnalysisOutput> {
  return checkoutRiskAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkoutRiskAnalysisPrompt',
  input: {schema: CheckoutRiskAnalysisInputSchema},
  output: {schema: CheckoutRiskAnalysisOutputSchema},
  prompt: `You are an AI assistant that analyzes checkout information for potential risks and missing data.

  Review the following checkout information and identify any missing fields, potential issues, or inconsistencies.

  Name: {{{name}}}
  Email: {{{email}}}
  Address: {{{address}}}
  City: {{{city}}}
  State: {{{state}}}
  Zip: {{{zip}}}
  Payment Method: {{{paymentMethod}}}
  Cart Contents: {{{cartContents}}}

  Based on this information, please provide a list of missing fields, a list of potential issues, and a summary of the overall risk assessment.

  Missing Fields:
  Potential Issues:
  Risk Assessment:`, // Enforce that output should have those properties
});

const checkoutRiskAnalysisFlow = ai.defineFlow(
  {
    name: 'checkoutRiskAnalysisFlow',
    inputSchema: CheckoutRiskAnalysisInputSchema,
    outputSchema: CheckoutRiskAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
