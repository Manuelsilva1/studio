
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary, Book } from '@/types'; // Combined Book import
// Removed mockBooks import
import { PosClient } from './components/pos-client';
// Import getBooks from API services
import { getBooks as apiGetBooks } from '@/services/api'; 

interface AdminPosPageProps {
  params: any;
}

export default async function AdminPosPage({ params: { lang } }: AdminPosPageProps) {
  const dictionary = await getDictionary(lang);
  const texts = dictionary.adminPanel?.posPage || {
    title: "Point of Sale",
    searchBooksPlaceholder: "Search books by title or author...",
    noResults: "No books found.",
    addToOrder: "Add",
    currentOrderTitle: "Current Order",
    emptyOrder: "No items in order.",
    bookColumn: "Book",
    priceColumn: "Price",
    quantityColumn: "Qty",
    totalColumn: "Total",
    actionsColumn: "Actions",
    orderSummaryTitle: "Order Summary",
    subtotal: "Subtotal:",
    grandTotal: "Grand Total:",
    paymentMethodTitle: "Payment Method",
    cash: "Cash",
    card: "Card",
    customerNameLabel: "Customer Name (Optional)",
    customerNamePlaceholder: "Enter customer name",
    completeSaleButton: "Complete Sale",
    processingSale: "Processing...",
    saleCompletedToastTitle: "Sale Completed!",
    saleCompletedToastDesc: "The sale has been processed successfully.",
    errorCompletingSale: "Error completing sale.",
    ticketDialog: {
      title: "Sale Receipt",
      saleId: "Sale ID:",
      date: "Date:",
      customer: "Customer:",
      item: "Item",
      qty: "Qty",
      price: "Price",
      total: "Total",
      subtotal: "Subtotal:",
      grandTotal: "Grand Total:",
      paymentMethod: "Payment Method:",
      cash: "Cash",
      card: "Card",
      notApplicableShort: "N/A",
      printButton: "Print (Simulated)",
      closeButton: "Close"
    }
  };
  
  // Fetch books from the API on the server side
  let books: Book[] = [];
  try {
    books = await apiGetBooks();
  } catch (error) {
    console.error("Failed to fetch books for POS page:", error);
    // Optionally, handle this error more gracefully, e.g., pass an error message to PosClient
    // or render an error state here. For now, PosClient will receive an empty allBooks array.
  }

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold text-primary">{texts.title}</h1>
      <PosClient 
        lang={lang} 
        dictionary={dictionary} 
        allBooks={books} 
        posTexts={texts} 
      />
    </div>
  );
}
