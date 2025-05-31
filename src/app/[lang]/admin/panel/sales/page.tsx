
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary } from '@/types'; // Updated import
import { getSaleRecords, type SaleRecord } from '@/lib/mock-data'; 
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
    notApplicable: "N/A",
    filterByYearLabel: "Year",
    filterByMonthLabel: "Month",
    filterByPaymentMethodLabel: "Payment Method",
    allYears: "All Years",
    allMonths: "All Months",
    allPaymentMethods: "All",
    resetFiltersButton: "Reset Filters",
    months: {
      january: "January", february: "February", march: "March", april: "April",
      may: "May", june: "June", july: "July", august: "August",
      september: "September", october: "October", november: "November", december: "December"
    }
  };
  
  const sales: SaleRecord[] = await getSaleRecords(); 

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
