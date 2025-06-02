'use server';
/**
 * @fileOverview A Genkit flow to design API endpoints based on a natural language description.
 *
 * - designApiEndpoints - A function that takes a description and returns a structured API design.
 * - DesignApiInput - The input type for the designApiEndpoints function.
 * - DesignApiOutput - The return type for the designApiEndpoints function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PathParameterSchema = z.object({
  name: z.string().describe('The name of the path parameter, e.g., "id".'),
  type: z.string().describe('The data type of the parameter, e.g., "string" or "number".'),
  description: z.string().describe('A brief description of the path parameter.'),
});

const SingleEndpointSchema = z.object({
  suggestedPath: z.string().describe('The suggested URL path for the endpoint, e.g., "/users/{id}". Should include path parameters if any.'),
  httpMethod: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).describe('The HTTP method for the endpoint.'),
  purpose: z.string().describe('A concise description of what this specific endpoint does.'),
  pathParameters: z.array(PathParameterSchema).optional().describe('An array of path parameters used in the suggestedPath, if any.'),
  requestBodySchema: z.string().optional().describe("A Zod schema string or a brief description of the request body structure. Example: 'z.object({ name: z.string(), email: z.string() })' or 'User details including name and email.'"),
  responseBodySchema: z.string().optional().describe("A Zod schema string or a brief description of the success response body structure. Example: 'z.object({ id: z.string(), name: z.string(), email: z.string() })' or 'The created/retrieved user object.'"),
  exampleRequest: z.string().optional().describe("A JSON example of a request body, if applicable. Use 'N/A' if not applicable (e.g., for GET requests without a body)."),
  exampleResponse: z.string().optional().describe("A JSON example of a success response body. Use 'N/A' if not applicable (e.g., for DELETE requests that return no content)."),
});

export const DesignApiInputSchema = z.object({
  description: z.string().describe('A natural language description of the API functionality needed. For example, "I need an API to manage user profiles. It should allow creating new users, retrieving a user by ID, updating user details, and deleting a user."'),
  preferredPathPrefix: z.string().optional().describe('An optional preferred prefix for all API paths, e.g., "/api/v1".'),
  dataFields: z.string().optional().describe('A comma-separated list or description of the primary data fields involved, e.g., "User: id, name, email, address. Post: id, title, content, authorId".'),
});
export type DesignApiInput = z.infer<typeof DesignApiInputSchema>;

export const DesignApiOutputSchema = z.object({
  apiEndpoints: z.array(SingleEndpointSchema).describe('An array of designed API endpoint specifications.'),
});
export type DesignApiOutput = z.infer<typeof DesignApiOutputSchema>;

const designApiPrompt = ai.definePrompt({
  name: 'designApiEndpointPrompt',
  input: { schema: DesignApiInputSchema },
  output: { schema: DesignApiOutputSchema },
  prompt: `You are an expert API designer tasked with creating RESTful API endpoint specifications based on a user's request.

User's Request:
----------------
Description: {{{description}}}
{{#if preferredPathPrefix}}Preferred Path Prefix: {{{preferredPathPrefix}}}{{/if}}
{{#if dataFields}}Key Data Fields/Entities: {{{dataFields}}}{{/if}}
----------------

Based on this request, design one or more API endpoints. For each endpoint, provide the following details:
1.  suggestedPath: A clear, conventional URL path. Use path parameters like {id} if needed. If a preferredPathPrefix is provided, use it.
2.  httpMethod: The most appropriate HTTP method (GET, POST, PUT, DELETE, PATCH).
3.  purpose: A brief, specific description of what the endpoint achieves.
4.  pathParameters (if any): An array detailing each path parameter, including its name, type (e.g., string, number), and description.
5.  requestBodySchema: A Zod schema string (e.g., "z.object({ field: z.string() })") or a concise textual description of the expected request body structure. If not applicable (like for most GET requests), state "N/A".
6.  responseBodySchema: A Zod schema string or a concise textual description of the success response body structure. For successful DELETE operations that return no content, this can be "N/A" or describe a 204 No Content response.
7.  exampleRequest: A valid JSON example of a request body. If not applicable, provide "N/A".
8.  exampleResponse: A valid JSON example of a successful response body. If not applicable (e.g. 204 No Content), provide "N/A".

Ensure the response is a JSON object with a single key "apiEndpoints", which is an array of these endpoint design objects.
If the user's request implies multiple operations (e.g., CRUD for users), design a separate endpoint object for each operation (Create, Read one, Read all, Update, Delete).
Think step-by-step to cover all aspects of standard API design for the requested functionality.
`,
});

const designApiEndpointsFlow = ai.defineFlow(
  {
    name: 'designApiEndpointsFlow',
    inputSchema: DesignApiInputSchema,
    outputSchema: DesignApiOutputSchema,
  },
  async (input) => {
    const { output } = await designApiPrompt(input);
    if (!output) {
      throw new Error('Failed to generate API design. The model did not return an output.');
    }
    return output;
  }
);

export async function designApiEndpoints(input: DesignApiInput): Promise<DesignApiOutput> {
  return designApiEndpointsFlow(input);
}
