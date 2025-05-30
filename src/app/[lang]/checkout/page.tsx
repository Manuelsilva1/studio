
import { PublicLayout } from '@/components/layout/public-layout';
import { CheckoutFormClient } from './components/checkout-form-client';
import { CartProvider } from '@/context/cart-provider';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';

interface CheckoutPageProps {
  params: { lang: string };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  
  return (
    <CartProvider> 
      <PublicLayout lang={lang} dictionary={dictionary}>
        <div className="container mx-auto px-4 py-12">
          <CheckoutFormClient lang={lang} dictionary={dictionary} />
        </div>
      </PublicLayout>
    </CartProvider>
  );
}
