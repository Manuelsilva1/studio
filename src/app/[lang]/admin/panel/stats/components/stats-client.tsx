
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { SaleRecord, Dictionary } from '@/types';
import {
  startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  format, parseISO, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
  isWithinInterval, subMonths, getMonth, getYear,
} from 'date-fns';
import { es as esLocale, enUS as enLocale } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, DollarSign, TrendingUp, ShoppingBag, Filter } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle } from '@/components/ui/chart';
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import type { DateRange } from "react-day-picker";

interface StatsClientProps {
  initialSales: SaleRecord[];
  texts: Dictionary['adminPanel']['statsPage'];
  lang: string;
  dictionary: Dictionary;
}

type SalesPeriod = 'daily' | 'weekly' | 'monthly';

interface SalesOverTimeData {
  date: string; // Formatted date string
  totalSales: number;
  count: number;
}

interface ProductCategorySalesData {
  genre: string;
  unitsSold: number;
  revenue: number;
}

const dateLocales: { [key: string]: Locale } = {
  en: enLocale,
  es: esLocale,
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82Ca9D'];

export function StatsClient({ initialSales, texts, lang, dictionary }: StatsClientProps) {
  const [sales, setSales] = useState<SaleRecord[]>(initialSales);
  const [salesPeriod, setSalesPeriod] = useState<SalesPeriod>('daily');
  // Initialize dateRange to undefined to prevent hydration mismatch
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [totalRevenueInDateRange, setTotalRevenueInDateRange] = useState<number | null>(null);

  const currentLocale = dateLocales[lang] || enLocale;

  // Set initial dateRange on the client side after mount
  useEffect(() => {
    const end = new Date();
    const start = subMonths(end, 1);
    setDateRange({ from: start, to: end });
  }, []);

  useEffect(() => {
    setSales(initialSales);
  }, [initialSales]);
  
  const salesOverTimeChartData = useMemo(() => {
    if (!sales.length) return [];
    const aggregatedSales: { [key: string]: { totalSales: number, count: number } } = {};

    sales.forEach(sale => {
      const saleDate = parseISO(sale.timestamp);
      let key = '';

      if (salesPeriod === 'daily') {
        key = format(saleDate, 'yyyy-MM-dd', { locale: currentLocale });
      } else if (salesPeriod === 'weekly') {
        key = format(startOfWeek(saleDate, { locale: currentLocale }), 'yyyy-MM-dd', { locale: currentLocale });
      } else if (salesPeriod === 'monthly') {
        key = format(saleDate, 'yyyy-MM', { locale: currentLocale });
      }

      if (!aggregatedSales[key]) {
        aggregatedSales[key] = { totalSales: 0, count: 0 };
      }
      aggregatedSales[key].totalSales += sale.totalAmount;
      aggregatedSales[key].count += 1;
    });
    
    const dataPoints: SalesOverTimeData[] = Object.entries(aggregatedSales)
      .map(([date, { totalSales, count }]) => ({
        date: salesPeriod === 'monthly' ? format(parseISO(date + '-01'), 'MMM yyyy', { locale: currentLocale }) : format(parseISO(date), 'P', { locale: currentLocale }),
        totalSales,
        count,
      }))
      .sort((a, b) => parseISO(a.date === format(parseISO(a.date), 'MMM yyyy', {locale: currentLocale}) ? a.date.split(" ").reverse().join("-") + "-01" : a.date).getTime() - parseISO(b.date === format(parseISO(b.date), 'MMM yyyy', {locale: currentLocale}) ? b.date.split(" ").reverse().join("-") + "-01" : b.date).getTime());

    return dataPoints;
  }, [sales, salesPeriod, currentLocale]);

  const salesOverTimeChartConfig = {
    totalSales: { label: texts.totalSales, color: "hsl(var(--chart-1))" },
    count: { label: texts.salesCount, color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  const bestSellingCategoriesData = useMemo(() => {
    if (!sales.length) return [];
    const categorySales: { [key: string]: { unitsSold: number, revenue: number } } = {};

    sales.forEach(sale => {
      sale.items.forEach(item => {
        const genre = item.book.genre || 'Unknown'; // Use genre as category
        if (!categorySales[genre]) {
          categorySales[genre] = { unitsSold: 0, revenue: 0 };
        }
        categorySales[genre].unitsSold += item.quantity;
        categorySales[genre].revenue += item.priceAtSale * item.quantity;
      });
    });
    
    return Object.entries(categorySales)
      .map(([genre, data]) => ({ genre, ...data }))
      .sort((a, b) => b.unitsSold - a.unitsSold) // Sort by units sold
      .slice(0, 10); // Top 10
  }, [sales]);

  const bestSellingCategoriesChartConfig = {
    unitsSold: { label: texts.unitsSold, color: "hsl(var(--chart-1))" },
    revenue: { label: texts.revenue, color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;


  const handleCalculateRevenue = () => {
    if (dateRange?.from && dateRange?.to) {
      const revenue = sales
        .filter(sale => {
          const saleDate = parseISO(sale.timestamp);
          return isWithinInterval(saleDate, { start: startOfDay(dateRange.from!), end: endOfDay(dateRange.to!) });
        })
        .reduce((sum, sale) => sum + sale.totalAmount, 0);
      setTotalRevenueInDateRange(revenue);
    } else {
      setTotalRevenueInDateRange(null);
    }
  };
  
  const monthlyComparisonData = useMemo(() => {
    if (!sales.length) return [];
    const monthlyData: { [key: string]: number } = {};
    const monthNames = dictionary.adminPanel.salesPage.months;

    sales.forEach(sale => {
      const saleDate = parseISO(sale.timestamp);
      const monthYearKey = format(saleDate, 'yyyy-MM', { locale: currentLocale });
      if (!monthlyData[monthYearKey]) {
        monthlyData[monthYearKey] = 0;
      }
      monthlyData[monthYearKey] += sale.totalAmount;
    });

    return Object.entries(monthlyData)
      .map(([key, totalSales]) => {
        const [year, monthNum] = key.split('-');
        const monthIndex = parseInt(monthNum, 10) -1;
        const monthName = Object.values(monthNames)[monthIndex] || `Month ${monthNum}`;
        return {
          month: `${monthName} ${year}`,
          totalSales,
        };
      })
      .sort((a,b) => {
         const [aMonthName, aYear] = a.month.split(' ');
         const [bMonthName, bYear] = b.month.split(' ');
         const aMonthIndex = Object.values(monthNames).indexOf(aMonthName);
         const bMonthIndex = Object.values(monthNames).indexOf(bMonthName);
         return new Date(parseInt(aYear), aMonthIndex).getTime() - new Date(parseInt(bYear), bMonthIndex).getTime();
      });
  }, [sales, currentLocale, dictionary.adminPanel.salesPage.months]);

  const monthlyComparisonChartConfig = {
    totalSales: { label: texts.totalSales, color: "hsl(var(--chart-3))" },
  } satisfies ChartConfig;


  return (
    <div className="grid gap-6">
      {/* Sales Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/>{texts.salesOverTimeTitle}</CardTitle>
          <Tabs value={salesPeriod} onValueChange={(value) => setSalesPeriod(value as SalesPeriod)} className="mt-2">
            <TabsList>
              <TabsTrigger value="daily">{texts.daily}</TabsTrigger>
              <TabsTrigger value="weekly">{texts.weekly}</TabsTrigger>
              <TabsTrigger value="monthly">{texts.monthly}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="h-[350px] -ml-4">
          {salesOverTimeChartData.length > 0 ? (
            <ChartContainer config={salesOverTimeChartConfig} className="w-full h-full">
              <LineChart data={salesOverTimeChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="date" tickFormatter={(tick) => salesPeriod === 'monthly' ? tick : format(parseISO(tick), 'dd MMM', { locale: currentLocale })} />
                <YAxis yAxisId="left" stroke="hsl(var(--chart-1))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line yAxisId="left" type="monotone" dataKey="totalSales" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name={texts.totalSales} />
                <Line yAxisId="right" type="monotone" dataKey="count" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name={texts.salesCount} />
              </LineChart>
            </ChartContainer>
          ) : (
            <p className="text-center text-muted-foreground py-10">{texts.noSalesData}</p>
          )}
        </CardContent>
      </Card>

      {/* Best-Selling Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><ShoppingBag className="mr-2 h-5 w-5 text-primary"/>{texts.bestSellingCategoriesTitle}</CardTitle>
          <CardDescription>{texts.category} vs {texts.unitsSold} & {texts.revenue}</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] -ml-4">
          {bestSellingCategoriesData.length > 0 ? (
          <ChartContainer config={bestSellingCategoriesChartConfig} className="w-full h-full">
            <BarChart data={bestSellingCategoriesData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="genre" type="category" width={100} tick={{fontSize: 12}}/>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="unitsSold" fill="hsl(var(--chart-1))" name={texts.unitsSold} radius={[0, 4, 4, 0]} />
              <Bar dataKey="revenue" fill="hsl(var(--chart-2))" name={texts.revenue} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
          ) : (
            <p className="text-center text-muted-foreground py-10">{texts.noSalesData}</p>
          )}
        </CardContent>
      </Card>
      
      {/* Total Revenue in Date Range */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary"/>{texts.totalRevenueTitle}</CardTitle>
          <CardDescription>{texts.selectDateRange}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={("w-[280px] justify-start text-left font-normal")}
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
                    <span>{texts.pickAStartDate}</span>
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
            <Button onClick={handleCalculateRevenue}><Filter className="mr-2 h-4 w-4"/>{texts.calculateRevenue}</Button>
          </div>
          {totalRevenueInDateRange !== null ? (
            <p className="text-lg font-semibold text-primary">
              {texts.revenueForPeriod
                .replace('{startDate}', dateRange?.from ? format(dateRange.from, "P", { locale: currentLocale }) : '')
                .replace('{endDate}', dateRange?.to ? format(dateRange.to, "P", { locale: currentLocale }) : '')
                .replace('{amount}', totalRevenueInDateRange.toFixed(2))
              }
            </p>
          ) : (
            dateRange?.from && dateRange?.to && <p className="text-muted-foreground">{texts.noSalesInRange}</p>
          )}
        </CardContent>
      </Card>

      {/* Monthly Sales Comparison */}
      <Card>
        <CardHeader>
           <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/>{texts.monthlyComparisonTitle}</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] -ml-4">
          {monthlyComparisonData.length > 0 ? (
          <ChartContainer config={monthlyComparisonChartConfig} className="w-full h-full">
            <BarChart data={monthlyComparisonData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="totalSales" fill="hsl(var(--chart-3))" name={texts.totalSales} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
          ) : (
             <p className="text-center text-muted-foreground py-10">{texts.noSalesData}</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

