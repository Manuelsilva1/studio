"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import { mockOffers } from '@/lib/mock-data';
import { suggestCartOffers, type SuggestCartOffersInput, type SuggestCartOffersOutput } from '@/ai/flows/cart-offers';
import type { GenAICartItem, GenAIAvailableOffer } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Tag, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function OfferAssistantClient() {
  const { cartItems } = useCart();
  const [suggestions, setSuggestions] = useState<SuggestCartOffersOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSuggestions = async () => {
    if (cartItems.length === 0) {
      setSuggestions(null);
      return;
    }
    setIsLoading(true);
    try {
      const genAICartItems: GenAICartItem[] = cartItems.map(item => ({
        name: item.book.title,
        price: item.book.price,
        quantity: item.quantity,
      }));
      const genAIAvailableOffers: GenAIAvailableOffer[] = mockOffers.map(offer => ({
        name: offer.name,
        description: offer.description,
        couponCode: offer.couponCode,
        conditions: offer.conditions,
      }));

      const input: SuggestCartOffersInput = {
        cartItems: genAICartItems,
        availableOffers: genAIAvailableOffers,
      };
      const result = await suggestCartOffers(input);
      setSuggestions(result);
    } catch (error) {
      console.error("Error fetching offer suggestions:", error);
      toast({
        title: "Offer Assistant Error",
        description: "Could not fetch offer suggestions at this time.",
        variant: "destructive",
      });
      setSuggestions(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Debounce or trigger on specific actions like adding/removing items
    // For simplicity, fetching on mount or when cartItems change significantly
    if (cartItems.length > 0) {
        fetchSuggestions();
    } else {
        setSuggestions(null); // Clear suggestions if cart is empty
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length]); // Re-fetch if number of items changes, simplistic trigger

  if (cartItems.length === 0) return null;


  return (
    <Card className="mt-8 shadow-lg rounded-lg bg-accent/10 border-accent">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center text-primary">
          <Sparkles className="mr-2 h-5 w-5" /> AI Offer Assistant
        </CardTitle>
        <CardDescription>Discover relevant offers for your current cart.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Finding best offers...</p>
          </div>
        )}
        {!isLoading && suggestions && suggestions.suggestedOffers.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground italic">{suggestions.reasoning}</p>
            {suggestions.suggestedOffers.map(offer => (
              <div key={offer.couponCode} className="p-3 border rounded-md bg-background shadow-sm">
                <h4 className="font-semibold text-md text-primary flex items-center">
                  <Tag className="mr-2 h-4 w-4" /> {offer.name}
                </h4>
                <p className="text-sm text-foreground/80 my-1">{offer.description}</p>
                <p className="text-xs">
                  Use code: <Badge variant="secondary" className="font-mono">{offer.couponCode}</Badge>
                </p>
              </div>
            ))}
          </div>
        )}
        {!isLoading && suggestions && suggestions.suggestedOffers.length === 0 && (
          <div className="text-center p-4">
            <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No specific offers match your current cart items.</p>
            {suggestions.reasoning && <p className="text-xs text-muted-foreground mt-2 italic">{suggestions.reasoning}</p>}
          </div>
        )}
         {!isLoading && !suggestions && (
           <div className="text-center p-4">
            <Button onClick={fetchSuggestions} variant="ghost" className="text-primary">
              <Sparkles className="mr-2 h-4 w-4" /> Check for Offers
            </Button>
           </div>
        )}
      </CardContent>
    </Card>
  );
}
