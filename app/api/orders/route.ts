import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { parseProduct, type ProductRow, type OrderItem } from "@/lib/types";
import { uniqueOrderNumber } from "@/lib/orders";

const schema = z.object({
  customerName: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().min(5, "Please enter a phone number"),
  address: z.string().trim().min(4, "Please enter your address"),
  city: z.string().trim().min(2, "Please enter your city"),
  postalCode: z.string().trim().min(2, "Please enter your postal code"),
  country: z.string().trim().default(""),
  notes: z.string().trim().max(1000).default(""),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        size: z.string().min(1),
        qty: z.number().int().min(1).max(20),
      })
    )
    .min(1, "Your cart is empty"),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.errors[0]?.message ?? "Invalid order";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  const data = parsed.data;
  const supabase = createSupabaseAdmin();

  // Rebuild line items from the database — never trust client prices.
  const productIds = [...new Set(data.items.map((i) => i.productId))];
  const { data: rows, error } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds)
    .eq("active", true);
  if (error) {
    return NextResponse.json(
      { error: "Could not verify products. Please try again." },
      { status: 500 }
    );
  }

  const byId = new Map(
    (rows as ProductRow[]).map((p) => [p.id, parseProduct(p)])
  );

  const items: OrderItem[] = [];
  let total = 0;

  for (const line of data.items) {
    const product = byId.get(line.productId);
    if (!product) {
      return NextResponse.json(
        { error: "One of the beds is no longer available." },
        { status: 400 }
      );
    }
    const size = product.sizes.find((s) => s.label === line.size);
    if (!size) {
      return NextResponse.json(
        { error: `Size ${line.size} is unavailable for ${product.name}.` },
        { status: 400 }
      );
    }
    items.push({
      productId: product.id,
      name: product.name,
      size: size.label,
      price: size.price,
      qty: line.qty,
    });
    total += size.price * line.qty;
  }

  const orderNumber = await uniqueOrderNumber();

  const { error: insertError } = await supabase.from("orders").insert({
    order_number: orderNumber,
    customer_name: data.customerName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    postal_code: data.postalCode,
    country: data.country,
    notes: data.notes,
    items,
    total,
    status: "PENDING",
  });

  if (insertError) {
    return NextResponse.json(
      { error: "Could not place the order. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ orderNumber, total });
}
