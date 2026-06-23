import { requireAuth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "../../actions";

export default function NewProductPage() {
  requireAuth();
  return (
    <AdminShell active="products">
      <h1 className="mb-8 font-serif text-3xl text-ink">New product</h1>
      <ProductForm action={createProduct} />
    </AdminShell>
  );
}
