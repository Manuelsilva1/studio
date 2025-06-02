
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { SaleRecord, Book, SaleItem, Dictionary } from '@/types';
import {
  startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  format, parseISO, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
  isWithinInterval, subDays
} from 'date-fns';
import { es as esLocale, enUS as enLocale } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, FileText, Download, Loader2, AlertTriangle } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

interface ReportsClientProps {
  initialSales: SaleRecord[];
  texts: Dictionary['adminPanel']['reportsPage'];
  lang: string;
  dictionary: Dictionary;
}

type SummaryLevel = 'none' | 'daily' | 'weekly' | 'monthly';

interface ReportData {
  totalSalesAmount: number;
  totalOrders: number;
  salesByPaymentMethod: { method: string; amount: number; count: number }[];
  salesByCategory: { category: string; quantity: number; amount: number }[];
  topSellingProducts: { title: string; quantity: number; revenue: number }[];
  periodicSummary?: { period: string; sales: number; orders: number }[];
  reportDateRange: { from: string; to: string };
}

const dateLocales: { [key: string]: Locale } = {
  en: enLocale,
  es: esLocale,
};

export function ReportsClient({ initialSales, texts, lang, dictionary }: ReportsClientProps) {
  const { toast } = useToast();
  const currentLocale = dateLocales[lang] || enLocale;

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
     const end = new Date();
     const start = subDays(end, 7); // Default to last 7 days
     return { from: start, to: end };
  });
  const [summaryLevel, setSummaryLevel] = useState<SummaryLevel>('none');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrencyUYU = (amount: number) => {
    return `UYU ${amount.toFixed(2)}`;
  };

  const handleGenerateReport = () => {
    if (!dateRange || !dateRange.from || !dateRange.to) {
      toast({
        title: texts.errorGeneratingReport,
        description: texts.pleaseSelectDateRange,
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setReportData(null);

    // Simulate delay for report generation
    setTimeout(() => {
      try {
        const filteredSales = initialSales.filter(sale => {
          const saleDate = parseISO(sale.timestamp);
          return isWithinInterval(saleDate, { start: startOfDay(dateRange.from!), end: endOfDay(dateRange.to!) });
        });

        if (filteredSales.length === 0) {
          setReportData({
            totalSalesAmount: 0,
            totalOrders: 0,
            salesByPaymentMethod: [],
            salesByCategory: [],
            topSellingProducts: [],
            reportDateRange: {
                from: format(dateRange.from!, 'P', { locale: currentLocale }),
                to: format(dateRange.to!, 'P', { locale: currentLocale })
            }
          });
          setIsLoading(false);
          return;
        }

        const totalSalesAmount = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const totalOrders = filteredSales.length;

        const salesByPaymentMethod: ReportData['salesByPaymentMethod'] = Object.values(
          filteredSales.reduce((acc, sale) => {
            acc[sale.paymentMethod] = acc[sale.paymentMethod] || { method: sale.paymentMethod, amount: 0, count: 0 };
            acc[sale.paymentMethod].amount += sale.totalAmount;
            acc[sale.paymentMethod].count += 1;
            return acc;
          }, {} as Record<string, { method: string; amount: number; count: number }>)
        );

        const salesByCategoryMap: { [key: string]: { category: string; quantity: number; amount: number } } = {};
        filteredSales.forEach(sale => {
          sale.items.forEach(item => {
            const category = item.book.genre || 'N/A';
            salesByCategoryMap[category] = salesByCategoryMap[category] || { category, quantity: 0, amount: 0 };
            salesByCategoryMap[category].quantity += item.quantity;
            salesByCategoryMap[category].amount += item.priceAtSale * item.quantity;
          });
        });
        const salesByCategory = Object.values(salesByCategoryMap).sort((a,b) => b.quantity - a.quantity);


        const productSalesMap: { [key: string]: { title: string; quantity: number; revenue: number } } = {};
        filteredSales.forEach(sale => {
          sale.items.forEach(item => {
            productSalesMap[item.book.title] = productSalesMap[item.book.title] || { title: item.book.title, quantity: 0, revenue: 0 };
            productSalesMap[item.book.title].quantity += item.quantity;
            productSalesMap[item.book.title].revenue += item.priceAtSale * item.quantity;
          });
        });
        const topSellingProducts = Object.values(productSalesMap).sort((a, b) => b.quantity - a.quantity).slice(0, 10);

        let periodicSummary: ReportData['periodicSummary'] | undefined = undefined;
        if (summaryLevel !== 'none') {
          const summaryMap: { [key: string]: { sales: number; orders: number } } = {};
          let intervalGetter: (date: Date) => Date;
          let periodFormatter: (date: Date) => string;

          if (summaryLevel === 'daily') {
            intervalGetter = startOfDay;
            periodFormatter = (date) => format(date, 'P', { locale: currentLocale });
          } else if (summaryLevel === 'weekly') {
            intervalGetter = (date) => startOfWeek(date, { locale: currentLocale });
            periodFormatter = (date) => `${format(startOfWeek(date, { locale: currentLocale }), 'P')} - ${format(endOfWeek(date, { locale: currentLocale }), 'P')}`;
          } else { // monthly
            intervalGetter = startOfMonth;
            periodFormatter = (date) => format(date, 'MMM yyyy', { locale: currentLocale });
          }

          filteredSales.forEach(sale => {
            const periodKey = format(intervalGetter(parseISO(sale.timestamp)), 'yyyy-MM-dd'); // Use consistent key for grouping
            summaryMap[periodKey] = summaryMap[periodKey] || { sales: 0, orders: 0 };
            summaryMap[periodKey].sales += sale.totalAmount;
            summaryMap[periodKey].orders += 1;
          });
          
          periodicSummary = Object.entries(summaryMap)
            .map(([key, data]) => ({
              period: periodFormatter(parseISO(key)),
              ...data
            }))
            .sort((a,b) => parseISO(a.period.split(' - ')[0]).getTime() - parseISO(b.period.split(' - ')[0]).getTime()); // Basic sort, might need adjustment for monthly
        }
        
        setReportData({
          totalSalesAmount,
          totalOrders,
          salesByPaymentMethod,
          salesByCategory,
          topSellingProducts,
          periodicSummary,
          reportDateRange: {
            from: format(dateRange.from!, 'P', { locale: currentLocale }),
            to: format(dateRange.to!, 'P', { locale: currentLocale })
          }
        });
      } catch (error) {
        console.error("Error generating report:", error);
        toast({ title: texts.errorGeneratingReport, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }, 500); 
  };

  const handleExport = (formatType: 'PDF' | 'Excel') => {
    toast({
      title: formatType === 'PDF' ? texts.exportPDFSimulated : texts.exportExcelSimulated,
      description: `Report for ${reportData?.reportDateRange.from} - ${reportData?.reportDateRange.to}`,
    });
  };
  
  const getSummaryPeriodType = () => {
    if (summaryLevel === 'daily') return texts.summaryDaily;
    if (summaryLevel === 'weekly') return texts.summaryWeekly;
    if (summaryLevel === 'monthly') return texts.summaryMonthly;
    return '';
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><FileText className="mr-2 h-6 w-6 text-primary" />{texts.title}</CardTitle>
          <CardDescription>Configure and generate sales reports.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="date-range" className="font-semibold">{texts.dateRangeLabel}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-range"
                    variant={"outline"}
                    className={("w-full justify-start text-left font-normal mt-1")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y", { locale: currentLocale })} -{" "}
                          {format(dateRange.to, "LLL dd, y", { locale: currentLocale })}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y", { locale: currentLocale })
                      )
                    ) : (
                      <span>{texts.pickDateRange}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={currentLocale}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="summary-level" className="font-semibold">{texts.summaryLevelLabel}</Label>
              <Select value={summaryLevel} onValueChange={(value) => setSummaryLevel(value as SummaryLevel)}>
                <SelectTrigger id="summary-level" className="mt-1">
                  <SelectValue placeholder={texts.summaryNone} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{texts.summaryNone}</SelectItem>
                  <SelectItem value="daily">{texts.summaryDaily}</SelectItem>
                  <SelectItem value="weekly">{texts.summaryWeekly}</SelectItem>
                  <SelectItem value="monthly">{texts.summaryMonthly}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateReport} disabled={isLoading} size="lg">
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <FileText className="mr-2 h-5 w-5" />}
            {isLoading ? texts.generatingReport : texts.generateReportButton}
          </Button>
        </CardFooter>
      </Card>

      {reportData && (
        <Card className="shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{texts.reportSectionTitle.replace('{startDate}', reportData.reportDateRange.from).replace('{endDate}', reportData.reportDateRange.to)}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}><Download className="mr-2 h-4 w-4" />{texts.exportPDFButton}</Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('Excel')}><Download className="mr-2 h-4 w-4" />{texts.exportExcelButton}</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {reportData.totalOrders === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    <AlertTriangle className="mx-auto h-12 w-12 text-orange-400 mb-4" />
                    {texts.noDataForReport}
                </div>
            ) : (
              <>
                <Card>
                  <CardHeader><CardTitle>{texts.overallSummaryTitle}</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{texts.totalSales}</p>
                      <p className="text-2xl font-bold">{formatCurrencyUYU(reportData.totalSalesAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{texts.totalOrders}</p>
                      <p className="text-2xl font-bold">{reportData.totalOrders}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>{texts.salesByPaymentMethodTitle}</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader><TableRow><TableHead>{texts.paymentMethod}</TableHead><TableHead className="text-right"># {texts.totalOrders}</TableHead><TableHead className="text-right">{texts.totalSales}</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {reportData.salesByPaymentMethod.map(item => (
                          <TableRow key={item.method}><TableCell className="capitalize">{item.method}</TableCell><TableCell className="text-right">{item.count}</TableCell><TableCell className="text-right">{formatCurrencyUYU(item.amount)}</TableCell></TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>{texts.salesByBookCategoryTitle}</CardTitle></CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      <Table>
                        <TableHeader><TableRow><TableHead>{texts.category}</TableHead><TableHead className="text-right">{texts.quantitySold}</TableHead><TableHead className="text-right">{texts.revenue}</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {reportData.salesByCategory.map(item => (
                            <TableRow key={item.category}><TableCell>{item.category}</TableCell><TableCell className="text-right">{item.quantity}</TableCell><TableCell className="text-right">{formatCurrencyUYU(item.amount)}</TableCell></TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader><CardTitle>{texts.topSellingProductsTitle}</CardTitle></CardHeader>
                  <CardContent>
                     <ScrollArea className="h-[200px]">
                      <Table>
                        <TableHeader><TableRow><TableHead>{texts.product}</TableHead><TableHead className="text-right">{texts.quantitySold}</TableHead><TableHead className="text-right">{texts.revenue}</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {reportData.topSellingProducts.map(item => (
                            <TableRow key={item.title}><TableCell>{item.title}</TableCell><TableCell className="text-right">{item.quantity}</TableCell><TableCell className="text-right">{formatCurrencyUYU(item.revenue)}</TableCell></TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {reportData.periodicSummary && reportData.periodicSummary.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle>{texts.periodicSummaryTitle.replace('{periodType}', getSummaryPeriodType())}</CardTitle></CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader><TableRow><TableHead>{texts.period}</TableHead><TableHead className="text-right"># {texts.totalOrders}</TableHead><TableHead className="text-right">{texts.totalSales}</TableHead></TableRow></TableHeader>
                          <TableBody>
                            {reportData.periodicSummary.map(item => (
                              <TableRow key={item.period}><TableCell>{item.period}</TableCell><TableCell className="text-right">{item.orders}</TableCell><TableCell className="text-right">{formatCurrencyUYU(item.sales)}</TableCell></TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
