"use client";

import { useTransition } from "react";

async function postJson(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };
    throw new Error(payload.error || "Request failed.");
  }
}

export function AddCategoryForm() {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        startTransition(async () => {
          await postJson("/api/dashboard/category", { name: form.get("name") });
          window.location.reload();
        });
      }}
    >
      <input name="name" placeholder="Category name" required className="flex-1 rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <button className="rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white" disabled={pending}>
        {pending ? "Saving..." : "Add"}
      </button>
    </form>
  );
}

export function AddMenuItemForm({ categories }: { categories: Array<{ id: string; name: string }> }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        startTransition(async () => {
          await postJson("/api/dashboard/menu-item", {
            categoryId: form.get("categoryId"),
            name: form.get("name"),
            description: form.get("description"),
            price: form.get("price"),
            imageUrl: form.get("imageUrl"),
            available: true,
            tags: form.get("tags")
          });
          window.location.reload();
        });
      }}
    >
      <select name="categoryId" required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
        <option value="">Select category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input name="name" placeholder="Item name" required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input name="description" placeholder="Description" required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2" />
      <input name="price" type="number" min="1" step="0.01" placeholder="Price" required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input name="imageUrl" placeholder="Image URL" className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input name="tags" placeholder="Popular, Spicy" className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2" />
      <button className="rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white md:col-span-2" disabled={pending}>
        {pending ? "Saving..." : "Add item"}
      </button>
    </form>
  );
}

export function AddTableForm() {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3 md:grid-cols-3"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        startTransition(async () => {
          await postJson("/api/dashboard/tables", { name: form.get("name"), number: form.get("number") });
          window.location.reload();
        });
      }}
    >
      <input name="name" placeholder="Table 7" required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2" />
      <input name="number" type="number" min="1" placeholder="7" required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <button className="rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white md:col-span-3" disabled={pending}>
        {pending ? "Saving..." : "Add table"}
      </button>
    </form>
  );
}

export function SettingsForm({
  restaurant
}: {
  restaurant: { address: string; currency: string; whatsappNumber: string; defaultLocale: string; logoUrl?: string };
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        startTransition(async () => {
          const selectedFile = form.get("logoFile");
          let logoUrl = String(form.get("logoUrl") ?? "").trim();

          if (selectedFile instanceof File && selectedFile.size > 0) {
            logoUrl = await fileToDataUrl(selectedFile);
          }

          await postJson("/api/dashboard/settings", {
            address: form.get("address"),
            currency: form.get("currency"),
            whatsappNumber: form.get("whatsappNumber"),
            defaultLocale: form.get("defaultLocale"),
            logoUrl
          });
          window.location.reload();
        });
      }}
    >
      <input defaultValue={restaurant.address} name="address" placeholder="Address" required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2" />
      <input defaultValue={restaurant.currency} name="currency" maxLength={3} required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input defaultValue={restaurant.whatsappNumber} name="whatsappNumber" required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input
        defaultValue={restaurant.logoUrl ?? ""}
        name="logoUrl"
        placeholder="Thumbnail URL (https://...)"
        className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2"
      />
      <input
        name="logoFile"
        type="file"
        accept="image/*"
        className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2"
      />
      <p className="text-xs text-[var(--muted)] md:col-span-2">You can paste an image URL or upload from device. If both are provided, uploaded file is used.</p>
      <select defaultValue={restaurant.defaultLocale} name="defaultLocale" className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2">
        <option value="en">English</option>
        <option value="ur">Urdu</option>
        <option value="ar">Arabic</option>
        <option value="it">Italian</option>
      </select>
      <button className="rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white md:col-span-2" disabled={pending}>
        {pending ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Unable to read selected image."));
    };
    reader.onerror = () => reject(new Error("Unable to read selected image."));
    reader.readAsDataURL(file);
  });
}
