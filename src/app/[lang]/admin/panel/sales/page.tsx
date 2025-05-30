
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import { getSaleRecords, type SaleRecord } from '@/lib/mock-data'; // Using mock data
import { SalesListClient } from './components/sales-list-client';

interface AdminSalesPageProps {
  params: {
    lang: string;
  };
}

export default async function AdminSalesPage({ params: { lang } }: AdminSalesPageProps) {
  const dictionary = await getDictionary(lang);
  const texts = dictionary.adminPanel?.salesPage || {
    title: "Sales History",
    noSalesFound: "No sales records found.",
    tableHeaderSaleId: "Sale ID",
    tableHeaderDate: "Date",
    tableHeaderCustomer: "Customer",
    tableHeaderTotalAmount: "Total Amount",
    tableHeaderPaymentMethod: "Payment Method",
    tableHeaderActions: "Actions",
    viewTicketButton: "View Ticket",
    cash: "Cash",
    card: "Card",
    notApplicable: "N/A"
  };
  
  const sales: SaleRecord[] = await getSaleRecords(); // Fetch sales records

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold text-primary">{texts.title}</h1>
      <SalesListClient 
        initialSales={sales} 
        lang={lang} 
        dictionary={dictionary} 
        salesTexts={texts}
      />
    </div>
  );
}
