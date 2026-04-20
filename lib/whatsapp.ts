export function buildWhatsAppMessage(input: {
  restaurantName: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  tableName?: string;
  orderItems: Array<{ name: string; quantity: number; lineTotal: number }>;
  total: number;
  currency: string;
}) {
  const lines = [
    `Restaurant: ${input.restaurantName}`,
    `Customer: ${input.customerName}`,
    `Phone: ${input.customerPhone}`,
    input.customerAddress ? `Address: ${input.customerAddress}` : null,
    input.tableName ? `Table: ${input.tableName}` : null,
    "",
    "Order:",
    ...input.orderItems.map((item) => `- ${item.name} x${item.quantity} = ${input.currency} ${item.lineTotal.toFixed(2)}`),
    "",
    `Total: ${input.currency} ${input.total.toFixed(2)}`
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildWhatsAppLink(phoneNumber: string, message: string) {
  const normalized = normalizeWhatsAppNumber(phoneNumber);
  return `https://api.whatsapp.com/send?phone=${normalized}&text=${encodeURIComponent(message)}`;
}

function normalizeWhatsAppNumber(phoneNumber: string) {
  let digits = phoneNumber.replace(/[^\d]/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  // Common Pakistan local formats to international format (app default market).
  if (digits.startsWith("0") && digits.length === 11) {
    digits = `92${digits.slice(1)}`;
  }
  if (digits.startsWith("3") && digits.length === 10) {
    digits = `92${digits}`;
  }

  return digits;
}
