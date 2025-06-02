
"use client";

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItemRowClient } from './cart-item-row-client';
import Link from 'next/link';
import { ShoppingCart, ArrowRight, PackageX } from 'lucide-react';
import type { Dictionary } from '@/types'; // Updated import

interface CartContentClientProps {
  lang: string;
  dictionary: Dictionary;
}

export function CartContentClient({ lang, dictionary }: CartContentClientProps) {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();

  const texts = dictionary.cartPage || { 
    emptyCartTitle: "Your Cart is Empty",
    emptyCartMessage: "Looks like you haven't added any books yet.",
    startShopping: "Start Shopping",
    yourShoppingCart: "Your Shopping Cart",
    itemsSuffix: "items",
    clearCart: "Clear Cart",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "FREE",
    total: "Total",
    proceedToCheckout: "Proceed to Checkout"
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <PackageX className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h2 className="font-headline text-3xl font-semibold mb-4">{texts.emptyCartTitle}</h2>
        <p className="text-muted-foreground mb-8">{texts.emptyCartMessage}</p>
        <Link href={`/${lang}/catalog`} passHref legacyBehavior>
          <Button size="lg">
            <ShoppingCart className="mr-2 h-5 w-5" /> {texts.startShopping}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card className="shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <ShoppingCart className="mr-3 h-7 w-7 text-primary" /> 
              {texts.yourShoppingCart} ({getItemCount()} {texts.itemsSuffix})
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {cartItems.map(item => (
              <CartItemRowClient key={item.book.id} item={item} lang={lang} />
            ))}
          </CardContent>
          {cartItems.length > 0 && (
            <CardFooter className="flex justify-end pt-4">
                <Button variant="outline" onClick={clearCart} className="text-destructive hover:text-destructive/80 hover:border-destructive/50">
                  {texts.clearCart}
                </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      <div className="md:col-span-1 space-y-8">
        <Card className="shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">{texts.orderSummary}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>{texts.subtotal}</span>
              <span>UYU {getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{texts.shipping}</span>
              <span className="text-primary">{texts.free}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>{texts.total}</span>
              <span>UYU {getCartTotal().toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/${lang}/checkout`} passHref legacyBehavior className="w-full">
              <Button size="lg" className="w-full font-headline text-lg">
                {texts.proceedToCheckout} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
