export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImage: string;
  price: number;
  stock: number;
  targetAudience?: string;
  themes?: string[];
  content?: string; // For book summary generation, can be a longer description or sample text
  publishedYear?: number;
  isbn?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  couponCode: string;
  conditions: string; // e.g., "min_purchase_50", "category_fiction"
}

// For GenAI flow inputs, ensuring consistency
export type GenAICartItem = {
  name: string;
  price: number;
  quantity: number;
};

export type GenAIAvailableOffer = {
  name: string;
  description: string;
  couponCode: string;
  conditions: string;
};
