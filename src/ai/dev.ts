import { config } from 'dotenv';
config();

import '@/ai/flows/auto-generate-book-description.ts';
import '@/ai/flows/cart-offers.ts';
import '@/ai/flows/book-summary.ts';
import '@/ai/flows/catalog-recommendations.ts';
import '@/ai/flows/checkout-risk-analysis.ts';