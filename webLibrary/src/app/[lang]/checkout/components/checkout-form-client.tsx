
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, ShieldCheck, Send, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { Dictionary } from '@/types'; // Updated import

const checkoutSchema = z.object({
  name: z.string().min(2, "Full name is required"), 
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code is required").regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
  paymentMethod: z.string().min(1, "Payment method is required (e.g. Credit Card, PayPal)"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormClientProps {
  lang: string;
  dictionary: Dictionary;
}

export function CheckoutFormClient({ lang, dictionary }: CheckoutFormClientProps) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const { toast } = useToast();

  const texts = dictionary.checkoutForm || { 
    secureCheckout: "Secure Checkout",
    fillDetails: "Please fill in your details to complete the purchase. Total: UYU {total}",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "John Doe",
    emailLabel: "Email Address",
    emailPlaceholder: "john.doe@example.com",
    addressLabel: "Street Address",
    addressPlaceholder: "123 Main St",
    cityLabel: "City",
    cityPlaceholder: "Anytown",
    stateLabel: "State / Province",
    statePlaceholder: "CA",
    zipLabel: "ZIP / Postal Code",
    zipPlaceholder: "90210",
    paymentMethodLabel: "Payment Method",
    paymentMethodPlaceholder: "e.g. Credit Card ending in 1234",
    paymentMethodDescription: "For demo purposes, any text is accepted.",
    placeOrder: "Place Order",
    orderSubmittedTitle: "Order Submitted!",
    orderSubmittedDescription: "Thank you for your purchase. Your order is being processed (simulated).",
    orderSubmittedConfirmation: "You will receive an email confirmation shortly.",
    continueShopping: "Continue Shopping",
    emptyCartTitle: "Your Cart is Empty",
    emptyCartDescription: "Please add items to your cart before proceeding to checkout.",
    returnToCart: "Return to Cart",
    orderSubmittedToast: "Order Submitted!",
    orderSubmittedToastDesc: "Your order has been successfully placed. (Simulated)",
    checkoutErrorToast: "Checkout Error",
    checkoutErrorToastDesc: "An unexpected error occurred. Please try again."
  };

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      paymentMethod: 'Credit Card', 
    },
  });

  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    setIsLoading(true);
    try {
      console.log("Order submitted:", data, cartItems);
      toast({
        title: texts.orderSubmittedToast,
        description: texts.orderSubmittedToastDesc,
      });
      clearCart();
      setIsOrderSubmitted(true);
      form.reset();
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: texts.checkoutErrorToast,
        description: texts.checkoutErrorToastDesc,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isOrderSubmitted) {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-xl rounded-lg">
        <CardHeader className="text-center">
          <ShieldCheck className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="font-headline text-3xl">{texts.orderSubmittedTitle}</CardTitle>
          <CardDescription>{texts.orderSubmittedDescription}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">{texts.orderSubmittedConfirmation}</p>
          <Link href={`/${lang}/catalog`} passHref legacyBehavior>
            <Button size="lg">{texts.continueShopping}</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (cartItems.length === 0 && !isOrderSubmitted) {
     return (
      <Card className="w-full max-w-lg mx-auto shadow-xl rounded-lg">
        <CardHeader className="text-center">
          <Info className="mx-auto h-16 w-16 text-blue-500 mb-4" />
          <CardTitle className="font-headline text-3xl">{texts.emptyCartTitle}</CardTitle>
          <CardDescription>{texts.emptyCartDescription}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href={`/${lang}/cart`} passHref legacyBehavior>
            <Button size="lg">{texts.returnToCart}</Button>
          </Link>
        </CardContent>
      </Card>
     );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">{texts.secureCheckout}</CardTitle>
            <CardDescription>{texts.fillDetails.replace('{total}', getCartTotal().toFixed(2))}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{texts.fullNameLabel}</FormLabel>
                    <FormControl><Input placeholder={texts.fullNamePlaceholder} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{texts.emailLabel}</FormLabel>
                    <FormControl><Input type="email" placeholder={texts.emailPlaceholder} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>{texts.addressLabel}</FormLabel>
                  <FormControl><Input placeholder={texts.addressPlaceholder} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{texts.cityLabel}</FormLabel>
                    <FormControl><Input placeholder={texts.cityPlaceholder} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{texts.stateLabel}</FormLabel>
                    <FormControl><Input placeholder={texts.statePlaceholder} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="zip" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{texts.zipLabel}</FormLabel>
                    <FormControl><Input placeholder={texts.zipPlaceholder} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
            </div>
             <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{texts.paymentMethodLabel}</FormLabel>
                    <FormControl><Input placeholder={texts.paymentMethodPlaceholder} {...field} /></FormControl>
                     <FormMessage />
                    <p className="text-xs text-muted-foreground">{texts.paymentMethodDescription}</p>
                  </FormItem>
              )} />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <Button type="submit" size="lg" disabled={isLoading} className="w-full font-headline text-lg">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Send className="mr-2 h-5 w-5" />
              )}
              {texts.placeOrder}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
