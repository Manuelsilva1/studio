
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/types'; // Updated import
import { mockBooks } from '@/lib/mock-data'; 
import type { Book } from '@/types';
import { PosClient } from './components/pos-client';

interface AdminPosPageProps {
  params: {
    lang: string;
  };
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
  
  const books: Book[] = [...mockBooks];

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
