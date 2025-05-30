
"use client";

import { useState, useEffect } from 'react';
import type { SaleRecord } from '@/types';
import type { Dictionary } from '@/lib/dictionaries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { SaleTicketDialog } from '@/app/[lang]/admin/panel/pos/components/sale-ticket-dialog'; // Re-using the dialog

interface SalesListClientProps {
  initialSales: SaleRecord[];
  lang: string;
  dictionary: Dictionary;
  salesTexts: Dictionary['adminPanel']['salesPage'];
}

export function SalesListClient({ initialSales, lang, dictionary, salesTexts }: SalesListClientProps) {
  const [sales, setSales] = useState<SaleRecord[]>(initialSales);
  const [selectedSaleForTicket, setSelectedSaleForTicket] = useState<SaleRecord | null>(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);

  useEffect(() => {
    setSales(initialSales);
  }, [initialSales]);

  const handleViewTicket = (sale: SaleRecord) => {
    setSelectedSaleForTicket(sale);
    setIsTicketDialogOpen(true);
  };

  const handleCloseTicketDialog = () => {
    setIsTicketDialogOpen(false);
    setSelectedSaleForTicket(null);
  };

  if (sales.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <p className="text-muted-foreground">{salesTexts.noSalesFound}</p>
      </div>
    );
  }

  return (
    <>
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
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-mono text-xs">{sale.id.substring(0, 8)}...</TableCell>
              <TableCell>{new Date(sale.timestamp).toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</TableCell>
              <TableCell>{sale.customerName || salesTexts.notApplicable}</TableCell>
              <TableCell className="text-right">${sale.totalAmount.toFixed(2)}</TableCell>
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

