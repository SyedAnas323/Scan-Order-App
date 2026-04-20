"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { buildWhatsAppLink, buildWhatsAppMessage } from "@/lib/whatsapp";
import { Dictionary, MenuCategory, MenuItem, Restaurant, Table } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type Cart = Record<string, number>;

export function PublicMenu({
  locale,
  restaurant,
  categories,
  menuItems,
  table,
  dictionary
}: {
  locale: "en" | "ur" | "ar" | "it";
  restaurant: Restaurant;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  table?: Table;
  dictionary: Dictionary;
}) {
  const [cart, setCart] = useState<Cart>({});
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [formError, setFormError] = useState("");

  const totals = useMemo(() => {
    const orderItems = Object.entries(cart)
      .map(([id, quantity]) => {
        const item = menuItems.find((entry) => entry.id === id);
        if (!item) {
          return null;
        }

        return {
          name: item.name,
          quantity,
          lineTotal: quantity * item.price
        };
      })
      .filter(Boolean) as Array<{ name: string; quantity: number; lineTotal: number }>;

    return {
      orderItems,
      total: orderItems.reduce((sum, item) => sum + item.lineTotal, 0)
    };
  }, [cart, menuItems]);

  const itemsLabel = {
    en: "items",
    ur: "?????",
    ar: "?????",
    it: "elementi"
  }[locale];

  const uiText = {
    en: {
      confirmOrder: "Confirm Order",
      yourName: "Your name",
      yourPhone: "Your phone number",
      yourAddress: "Delivery address",
      tableNumber: "Table number",
      sendToWhatsApp: "Send to WhatsApp",
      fillDetails: "Please fill all required details."
    },
    ur: {
      confirmOrder: "???? ????? ????",
      yourName: "?? ?? ???",
      yourPhone: "?? ?? ??? ????",
      yourAddress: "???",
      tableNumber: "???? ????",
      sendToWhatsApp: "WhatsApp ?? ??????",
      fillDetails: "???? ??? ???? ????? ??????? ???? ?????"
    },
    ar: {
      confirmOrder: "????? ?????",
      yourName: "?????",
      yourPhone: "??? ??????",
      yourAddress: "???????",
      tableNumber: "??? ???????",
      sendToWhatsApp: "????? ??? ??????",
      fillDetails: "???? ????? ???? ???????? ????????."
    },
    it: {
      confirmOrder: "Conferma ordine",
      yourName: "Il tuo nome",
      yourPhone: "Il tuo numero",
      yourAddress: "Indirizzo",
      tableNumber: "Numero tavolo",
      sendToWhatsApp: "Invia su WhatsApp",
      fillDetails: "Compila tutti i campi obbligatori."
    }
  }[locale];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        {categories.map((category) => {
          const items = menuItems.filter((item) => item.categoryId === category.id);
          if (!items.length) {
            return null;
          }

          return (
            <section key={category.id}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <div className="pill">{items.length} {itemsLabel}</div>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <article key={item.id} className="glass overflow-hidden rounded-[2rem]">
                    <div className="grid gap-0 md:grid-cols-[180px_1fr]">
                      <div className="relative min-h-48">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[var(--accent)]/40 text-lg font-semibold">{item.name}</div>
                        )}
                      </div>
                      <div className="p-4 sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
                          <div>
                            <h3 className="text-xl font-bold">{item.name}</h3>
                            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
                          </div>
                          <div className="text-base font-bold sm:text-lg">{formatCurrency(item.price, restaurant.currency)}</div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {item.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--brand-dark)]">
                              {tag}
                            </span>
                          ))}
                          {!item.available ? <span className="pill">{dictionary.customer.unavailable}</span> : null}
                        </div>
                        <button
                          disabled={!item.available}
                          onClick={() => setCart((current) => ({ ...current, [item.id]: (current[item.id] || 0) + 1 }))}
                          className="mt-5 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-300"
                        >
                          {dictionary.customer.addToCart}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <aside className="glass h-fit rounded-[2rem] p-5 lg:sticky lg:top-6">
        <div className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">{restaurant.name}</div>
        <h2 className="mt-2 text-2xl font-bold">{dictionary.customer.browseMenu}</h2>
        {table ? (
          <p className="mt-2 text-sm text-[var(--muted)]">
            {dictionary.customer.table}: {table.name}
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          {totals.orderItems.length ? (
            totals.orderItems.map((item) => (
              <div key={item.name} className="flex justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white/75 px-4 py-3 text-sm">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{formatCurrency(item.lineTotal, restaurant.currency)}</span>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-5 text-sm text-[var(--muted)]">
              {dictionary.customer.emptyCart}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between text-lg font-bold">
          <span>{dictionary.customer.total}</span>
          <span>{formatCurrency(totals.total, restaurant.currency)}</span>
        </div>

        <button
          type="button"
          disabled={!totals.orderItems.length}
          onClick={() => {
            setShowConfirmForm(true);
            setFormError("");
          }}
          className="mt-6 w-full rounded-2xl bg-[var(--success)] px-4 py-3 text-center font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {uiText.confirmOrder}
        </button>

        {showConfirmForm ? (
          <form
            className="mt-4 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const name = customerName.trim();
              const phone = customerPhone.trim();
              const address = customerAddress.trim();

              if (!name || !phone || (!table && !address)) {
                setFormError(uiText.fillDetails);
                return;
              }

              const message = buildWhatsAppMessage({
                restaurantName: restaurant.name,
                customerName: name,
                customerPhone: phone,
                customerAddress: address || undefined,
                tableName: table ? `${table.name} (${table.number})` : undefined,
                orderItems: totals.orderItems,
                total: totals.total,
                currency: restaurant.currency
              });
              const whatsappLink = buildWhatsAppLink(restaurant.whatsappNumber, message);
              window.open(whatsappLink, "_blank", "noopener,noreferrer");

              fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  restaurantId: restaurant.id,
                  tableId: table?.id,
                  customerName: name,
                  customerPhone: phone,
                  customerAddress: address || undefined,
                  source: table ? "qr" : "web",
                  items: totals.orderItems.map((item) => ({
                    menuItemName: item.name,
                    quantity: item.quantity,
                    unitPrice: item.lineTotal / item.quantity,
                    lineTotal: item.lineTotal
                  }))
                })
              })
                .then(async (response) => {
                  if (!response.ok) {
                    const payload = (await response.json()) as { error?: string };
                    throw new Error(payload.error || uiText.fillDetails);
                  }
                  return response.json();
                })
                .then(() => setFormError(""))
                .catch((error: unknown) => {
                  const baseMessage = error instanceof Error ? error.message : uiText.fillDetails;
                  setFormError(`${baseMessage} WhatsApp sent, but dashboard sync failed.`);
                });
            }}
          >
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder={uiText.yourName}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
              required
            />
            <input
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              placeholder={uiText.yourPhone}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
              required
            />
            {table ? (
              <input
                value={`${uiText.tableNumber}: ${table.number}`}
                readOnly
                aria-label={uiText.tableNumber}
                className="rounded-2xl border border-[var(--border)] bg-stone-100 px-4 py-3 text-[var(--muted)]"
              />
            ) : (
              <input
                value={customerAddress}
                onChange={(event) => setCustomerAddress(event.target.value)}
                placeholder={uiText.yourAddress}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
                required
              />
            )}
            {formError ? <p className="text-sm text-rose-700">{formError}</p> : null}
            <button type="submit" className="rounded-2xl bg-[var(--brand)] px-4 py-3 text-center font-semibold text-white">
              {uiText.sendToWhatsApp}
            </button>
          </form>
        ) : null}
      </aside>
    </div>
  );
}
