
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { SaleRecord } from '@/types';
import type { Dictionary } from '@/types'; // Updated import
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, FilterX } from 'lucide-react';
import { SaleTicketDialog } from '@/app/[lang]/admin/panel/pos/components/sale-ticket-dialog';

interface SalesListClientProps {
  initialSales: SaleRecord[];
  lang: string;
  dictionary: Dictionary;
  salesTexts: Dictionary['adminPanel']['salesPage'];
}

export function SalesListClient({ initialSales, lang, dictionary, salesTexts }: SalesListClientProps) {
  const [selectedSaleForTicket, setSelectedSaleForTicket] = useState<SaleRecord | null>(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);

  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all'); // 01-12
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'all' | 'cash' | 'card'>('all');

  const availableYears = useMemo(() => {
    if (!initialSales.length) return [];
    const years = new Set(initialSales.map(sale => new Date(sale.timestamp).getFullYear().toString()));
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [initialSales]);

  const monthOptions = useMemo(() => {
    const monthsData = salesTexts.months || { // Add fallback for monthsData
      january: "January", february: "February", march: "March", april: "April",
      may: "May", june: "June", july: "July", august: "August",
      september: "September", october: "October", november: "November", december: "December"
    };
    return [
      { value: '01', label: monthsData.january }, { value: '02', label: monthsData.february },
      { value: '03', label: monthsData.march }, { value: '04', label: monthsData.april },
      { value: '05', label: monthsData.may }, { value: '06', label: monthsData.june },
      { value: '07', label: monthsData.july }, { value: '08', label: monthsData.august },
      { value: '09', label: monthsData.september }, { value: '10', label: monthsData.october },
      { value: '11', label: monthsData.november }, { value: '12', label: monthsData.december },
    ];
  }, [salesTexts.months]);

  const filteredSales = useMemo(() => {
    return initialSales.filter(sale => {
      const saleDate = new Date(sale.timestamp);
      const saleYear = saleDate.getFullYear().toString();
      const saleMonth = (saleDate.getMonth() + 1).toString().padStart(2, '0');

      const yearMatch = selectedYear === 'all' || saleYear === selectedYear;
      const monthMatch = selectedMonth === 'all' || saleMonth === selectedMonth;
      const paymentMethodMatch = selectedPaymentMethod === 'all' || sale.paymentMethod === selectedPaymentMethod;

      return yearMatch && monthMatch && paymentMethodMatch;
    });
  }, [initialSales, selectedYear, selectedMonth, selectedPaymentMethod]);

  const handleViewTicket = (sale: SaleRecord) => {
    setSelectedSaleForTicket(sale);
    setIsTicketDialogOpen(true);
  };

  const handleCloseTicketDialog = () => {
    setIsTicketDialogOpen(false);
    setSelectedSaleForTicket(null);
  };

  const resetFilters = () => {
    setSelectedYear('all');
    setSelectedMonth('all');
    setSelectedPaymentMethod('all');
  };

  return (
    <>
      <Card className="mb-6 shadow-md rounded-lg">
        <CardContent className="p-4 space-y-4 md:space-y-0 md:flex md:flex-wrap md:items-end md:gap-4">
          <div className="flex-1 min-w-[150px]">
            <Label htmlFor="filter-year">{salesTexts.filterByYearLabel}</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="filter-year">
                <SelectValue placeholder={salesTexts.allYears} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{salesTexts.allYears}</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <Label htmlFor="filter-month">{salesTexts.filterByMonthLabel}</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger id="filter-month">
                <SelectValue placeholder={salesTexts.allMonths} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{salesTexts.allMonths}</SelectItem>
                {monthOptions.map(month => (
                  <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[180px]">
            <Label htmlFor="filter-payment">{salesTexts.filterByPaymentMethodLabel}</Label>
            <Select value={selectedPaymentMethod} onValueChange={(value) => setSelectedPaymentMethod(value as 'all' | 'cash' | 'card')}>
              <SelectTrigger id="filter-payment">
                <SelectValue placeholder={salesTexts.allPaymentMethods} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{salesTexts.allPaymentMethods}</SelectItem>
                <SelectItem value="cash">{salesTexts.cash}</SelectItem>
                <SelectItem value="card">{salesTexts.card}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={resetFilters} variant="outline" className="w-full md:w-auto mt-4 md:mt-0">
            <FilterX className="mr-2 h-4 w-4" />
            {salesTexts.resetFiltersButton}
          </Button>
        </CardContent>
      </Card>

      {filteredSales.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">{salesTexts.noSalesFound}</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{salesTexts.tableHeaderSaleId}</TableHead>
              <TableHead>{salesTexts.tableHeaderDate}</TableHead>
              <TableHead>{salesTexts.tableHeaderCustomer}</TableHead>
              <TableHead className="text-right">{salesTexts.tableHeaderTotalAmount}</TableHead>
              <TableHead>{salesTexts.tableHeaderPaymentMethod}</TableHead>
              <TableHead className="text-center">{salesTexts.tableHeaderActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-mono text-xs">{sale.id.substring(0, 8)}...</TableCell>
                <TableCell>{new Date(sale.timestamp).toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</TableCell>
                <TableCell>{sale.customerName || salesTexts.notApplicable}</TableCell>
                <TableCell className="text-right">UYU {sale.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{sale.paymentMethod === 'cash' ? salesTexts.cash : salesTexts.card}</TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" size="sm" onClick={() => handleViewTicket(sale)}>
                    <Eye className="mr-1 h-4 w-4" /> {salesTexts.viewTicketButton}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedSaleForTicket && (
        <SaleTicketDialog
          isOpen={isTicketDialogOpen}
          onClose={handleCloseTicketDialog}
          saleRecord={selectedSaleForTicket}
          dictionary={dictionary}
        />
      )}
    </>
  );
}
