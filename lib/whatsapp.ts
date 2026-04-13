export function buildWhatsAppMessage(input: {
  restaurantName: string;
  tableName?: string;
  orderItems: Array<{ name: string; quantity: number; lineTotal: number }>;
  total: number;
  currency: string;
}) {
  const lines = [
    `Restaurant: ${input.restaurantName}`,
    input.tableName ? `Table: ${input.tableName}` : null,
    "",
    "Order:",
    ...input.orderItems.map((item) => `- ${item.name} x${item.quantity} = ${input.currency} ${item.lineTotal}`),
    "",
    `Total: ${input.currency} ${input.total}`
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildWhatsAppLink(phoneNumber: string, message: string) {
  const sanitized = phoneNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}
