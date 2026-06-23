import { prisma } from "./db";

/** Human-friendly order number like LUN-7F3K9. */
export function generateOrderNumber(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `LUN-${code}`;
}

export async function uniqueOrderNumber(): Promise<string> {
  for (let i = 0; i < 6; i++) {
    const n = generateOrderNumber();
    const existing = await prisma.order.findUnique({ where: { orderNumber: n } });
    if (!existing) return n;
  }
  // Fallback with timestamp suffix
  return `LUN-${Date.now().toString(36).toUpperCase()}`;
}
