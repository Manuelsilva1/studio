import 'server-only'; // Ensures this runs only on the server

// Define a type for the dictionary structure for better type safety
// You can expand this type as you add more translations
export type Dictionary = {
  siteName: string;
  description: string;
  header: {
    catalog: string;
    cart: string;
    admin: string;
    toggleTheme: string;
    changeLanguage: string;
  };
  footer: {
    copyright: string;
  };
  splashPage: {
    welcome: string;
    tagline: string;
    enterCatalog: string;
  };
  languages: {
    english: string;
    spanish: string;
  };
  // Add other sections as needed
  [key: string]: any; // Allow for dynamic keys for now
};

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default as Dictionary),
  es: () => import('@/dictionaries/es.json').then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  if (locale === 'es') {
    return dictionaries.es();
  }
  // Default to English if locale is not 'es' or if it's undefined/invalid
  return dictionaries.en();
};
