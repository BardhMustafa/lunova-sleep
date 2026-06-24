import { CartProvider } from "@/components/cart-context";
import { I18nProvider } from "@/components/i18n-provider";
import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { getLocale, getDictionary } from "@/lib/i18n/server";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();
  const dict = getDictionary(locale);

  return (
    <I18nProvider dict={dict} locale={locale}>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CartDrawer />
      </CartProvider>
    </I18nProvider>
  );
}
