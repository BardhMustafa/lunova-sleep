import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { updateProduct } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAuth();
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <AdminShell active="products">
      <h1 className="mb-8 font-serif text-3xl text-ink">
        Edit · {product.name}
      </h1>
      <ProductForm action={updateProduct} product={product} />
    </AdminShell>
  );
}
