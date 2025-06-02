'use server';

import { genkit, googleAI } from 'genkit';

// IMPORTANT: You need to set your GEMINI_API_KEY in the .env file for this flow to work.
// Add a line like this to your .env file:
// GEMINI_API_KEY=your_actual_api_key_here

if (!process.env.GEMINI_API_KEY && process.env.NODE_ENV === 'production') {
  // In production, we might want to throw an error or have a more robust check.
  // For now, a warning if it's missing is good for development.
  console.warn(
    'GEMINI_API_KEY is not set. AI features requiring it may not work. Please add it to your .env file.'
  );
} else if (!process.env.GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY is not set. Using Genkit with potentially limited or unconfigured models. Please add GEMINI_API_KEY to your .env file for full functionality.');
}


// Export the configured 'ai' object for use in defining flows, prompts, etc.
// This instance uses the Google AI plugin, configured to use the GEMINI_API_KEY
// from your environment variables.
export const ai = genkit({
  plugins: [
    googleAI(), // Ensure you have @genkit-ai/google-ai or similar installed if not core
  ],
  // Note: logLevel and enableTracing are typically set in configureGenkit() for global settings,
  // not directly in genkit() in Genkit v1.x.
  // If you need to configure these globally, you would use:
  // import { configureGenkit } from 'genkit';
  // configureGenkit({ plugins: [googleAI()], logLevel: 'debug', enableTracing: true });
  // However, the example flows provided in the prompt use an exported 'ai' object.
});
