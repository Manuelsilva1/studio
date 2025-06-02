
import { Suspense } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import type { Dictionary, SaleRecord } from '@/types';
import { getSaleRecords } from '@/lib/mock-data';
import { Loader2 } from 'lucide-react';
import { ReportsClient } from './components/reports-client';

interface AdminReportsPageProps {
  params: { lang: string };
}

export default async function AdminReportsPage({ params }: AdminReportsPageProps) {
  const { lang } = params;
  const dictionary: Dictionary = await getDictionary(lang);
  const reportsTexts = dictionary.adminPanel?.reportsPage || {
    title: "Reports",
    generateReportButton: "Generate Report",
    exportPDFButton: "Export to PDF",
    exportExcelButton: "Export to Excel",
    dateRangeLabel: "Date Range",
    pickDateRange: "Pick a date range",
    summaryLevelLabel: "Summary Level",
    summaryNone: "None",
    summaryDaily: "Daily",
    summaryWeekly: "Weekly",
    summaryMonthly: "Monthly",
    reportSectionTitle: "Report for: {startDate} - {endDate}",
    overallSummaryTitle: "Overall Summary",
    totalSales: "Total Sales (UYU)",
    totalOrders: "Total Orders",
    salesByPaymentMethodTitle: "Sales by Payment Method",
    paymentMethod: "Payment Method",
    salesByBookCategoryTitle: "Sales by Book Category",
    category: "Category",
    quantitySold: "Quantity Sold",
    topSellingProductsTitle: "Top Selling Products",
    product: "Product",
    revenue: "Revenue (UYU)",
    periodicSummaryTitle: "{periodType} Sales Summary",
    period: "Period",
    noDataForReport: "No sales data available for the selected criteria.",
    generatingReport: "Generating report...",
    exportPDFSimulated: "PDF export simulated.",
    exportExcelSimulated: "Excel export simulated.",
    errorGeneratingReport: "Error generating report. Please try again.",
    pleaseSelectDateRange: "Please select a date range to generate the report."
  };

  const initialSalesData: SaleRecord[] = await getSaleRecords();

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold text-primary">{reportsTexts.title}</h1>
      <Suspense fallback={<div className="flex justify-center items-center min-h-[300px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <ReportsClient
          initialSales={initialSalesData}
          texts={reportsTexts}
          lang={lang}
          dictionary={dictionary}
        />
      </Suspense>
    </div>
  );
}
