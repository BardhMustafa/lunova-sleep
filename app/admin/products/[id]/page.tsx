import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseProduct } from "@/lib/types";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { updateProduct } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  requireAuth();
  const row = await prisma.product.findUnique({ where: { id: params.id } });
  if (!row) notFound();
  const product = parseProduct(row);

  return (
    <AdminShell active="products">
      <h1 className="mb-8 font-serif text-3xl text-ink">
        Edit · {product.name}
      </h1>
      <ProductForm action={updateProduct} product={product} />
    </AdminShell>
  );
}
