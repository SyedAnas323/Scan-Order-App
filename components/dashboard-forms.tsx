"use client";

import { useState, useTransition } from "react";
import { MenuItem } from "@/lib/types";

async function requestJson(url: string, body: Record<string, unknown>, method: "POST" | "PUT" | "DELETE" = "POST") {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };
    throw new Error(payload.error || "Request failed.");
  }
}

type MenuLabels = {
  selectCategory: string;
  itemName: string;
  description: string;
  price: string;
  imageUrl: string;
  imageFromDevice: string;
  tags: string;
  addItem: string;
  saveChanges: string;
  saving: string;
  uploadHint: string;
  edit: string;
  delete: string;
  deleteConfirm: string;
  cancel: string;
  available: string;
};

const defaultMenuLabels: MenuLabels = {
  selectCategory: "Select category",
  itemName: "Item name",
  description: "Description",
  price: "Price",
  imageUrl: "Image URL",
  imageFromDevice: "Upload image from device",
  tags: "Popular, Spicy",
  addItem: "Add item",
  saveChanges: "Save changes",
  saving: "Saving...",
  uploadHint: "You can paste an image URL or upload from device. If both are provided, uploaded file is used.",
  edit: "Edit",
  delete: "Delete",
  deleteConfirm: "Are you sure you want to delete this menu item?",
  cancel: "Cancel",
  available: "Available"
};

export function AddCategoryForm({
  labels
}: {
  labels?: { categoryName?: string; add?: string; saving?: string };
}) {
  const [pending, startTransition] = useTransition();
  const text = {
    categoryName: labels?.categoryName ?? "Category name",
    add: labels?.add ?? "Add",
    saving: labels?.saving ?? "Saving..."
  };

  return (
    <form
      className="flex gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        startTransition(async () => {
          await requestJson("/api/dashboard/category", { name: form.get("name") });
          window.location.reload();
        });
      }}
    >
      <input name="name" placeholder={text.categoryName} required className="flex-1 rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <button className="rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white" disabled={pending}>
        {pending ? text.saving : text.add}
      </button>
    </form>
  );
}

export function AddMenuItemForm({
  categories,
  labels
}: {
  categories: Array<{ id: string; name: string }>;
  labels?: Partial<MenuLabels>;
}) {
  const [pending, startTransition] = useTransition();
  const text = { ...defaultMenuLabels, ...labels };

  return (
    <form
      className="grid gap-3 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        startTransition(async () => {
          const selectedFile = form.get("imageFile");
          let imageUrl = String(form.get("imageUrl") ?? "").trim();

          if (selectedFile instanceof File && selectedFile.size > 0) {
            imageUrl = await fileToDataUrl(selectedFile);
          }

          await requestJson("/api/dashboard/menu-item", {
            categoryId: form.get("categoryId"),
            name: form.get("name"),
            description: form.get("description"),
            price: form.get("price"),
            imageUrl,
            available: true,
            tags: form.get("tags")
          });
          window.location.reload();
        });
      }}
    >
      <select name="categoryId" required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
        <option value="">{text.selectCategory}</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input name="name" placeholder={text.itemName} required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input name="description" placeholder={text.description} required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2" />
      <input name="price" type="number" min="1" step="0.01" placeholder={text.price} required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input name="imageUrl" placeholder={text.imageUrl} className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input name="imageFile" type="file" accept="image/*" className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2" />
      <p className="text-xs text-[var(--muted)] md:col-span-2">{text.uploadHint}</p>
      <input name="tags" placeholder={text.tags} className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2" />
      <button className="rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white md:col-span-2" disabled={pending}>
        {pending ? text.saving : text.addItem}
      </button>
    </form>
  );
}

export function MenuItemEditor({
  item,
  categories,
  labels
}: {
  item: MenuItem;
  categories: Array<{ id: string; name: string }>;
  labels?: Partial<MenuLabels>;
}) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const text = { ...defaultMenuLabels, ...labels };

  if (!editing) {
    return (
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold"
        >
          {text.edit}
        </button>
        <button
          type="button"
          onClick={() => {
            if (!window.confirm(text.deleteConfirm)) {
              return;
            }

            startTransition(async () => {
              await requestJson("/api/dashboard/menu-item", { id: item.id }, "DELETE");
              window.location.reload();
            });
          }}
          className="rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700"
          disabled={pending}
        >
          {pending ? text.saving : text.delete}
        </button>
      </div>
    );
  }

  return (
    <form
      className="mt-4 grid gap-3 rounded-2xl border border-[var(--border)] bg-white/80 p-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        startTransition(async () => {
          const selectedFile = form.get("imageFile");
          let imageUrl = String(form.get("imageUrl") ?? "").trim();

          if (selectedFile instanceof File && selectedFile.size > 0) {
            imageUrl = await fileToDataUrl(selectedFile);
          }

          await requestJson(
            "/api/dashboard/menu-item",
            {
              id: item.id,
              categoryId: form.get("categoryId"),
              name: form.get("name"),
              description: form.get("description"),
              price: form.get("price"),
              imageUrl,
              available: form.get("available") === "on",
              tags: form.get("tags")
            },
            "PUT"
          );
          window.location.reload();
        });
      }}
    >
      <select defaultValue={item.categoryId} name="categoryId" required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input defaultValue={item.name} name="name" placeholder={text.itemName} required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input defaultValue={item.description} name="description" placeholder={text.description} required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2" />
      <input defaultValue={String(item.price)} name="price" type="number" min="1" step="0.01" placeholder={text.price} required className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input defaultValue={item.imageUrl ?? ""} name="imageUrl" placeholder={text.imageUrl} className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3" />
      <input name="imageFile" type="file" accept="image/*" className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2" />
      <input defaultValue={item.tags.join(", ")} name="tags" placeholder={text.tags} className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2" />
      <label className="inline-flex items-center gap-2 text-sm md:col-span-2">
        <input defaultChecked={item.available} name="available" type="checkbox" />
        <span>{text.available}</span>
      </label>
      <div className="flex flex-wrap gap-2 md:col-span-2">
        <button type="submit" className="rounded-2xl bg-[var(--brand)] px-4 py-3 font-semibold text-white" disabled={pending}>
          {pending ? text.saving : text.saveChanges}
        </button>
        <button type="button" onClick={() => setEditing(false)} className="rounded-2xl border border-[var(--border)] px-4 py-3 font-semibold">
          {text.cancel}
        </button>
      </div>
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
          await requestJson("/api/dashboard/tables", { name: form.get("name"), number: form.get("number") });
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
  restaurant: { address: string; currency: string; whatsappNumber: string; defaultLocale: string; logoUrl?: string; bannerUrl?: string };
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        startTransition(async () => {
          const selectedLogoFile = form.get("logoFile");
          const selectedBannerFile = form.get("bannerFile");
          let logoUrl = String(form.get("logoUrl") ?? "").trim();
          let bannerUrl = String(form.get("bannerUrl") ?? "").trim();

          if (selectedLogoFile instanceof File && selectedLogoFile.size > 0) {
            logoUrl = await fileToDataUrl(selectedLogoFile);
          }

          if (selectedBannerFile instanceof File && selectedBannerFile.size > 0) {
            bannerUrl = await fileToDataUrl(selectedBannerFile);
          }

          await requestJson("/api/dashboard/settings", {
            address: form.get("address"),
            currency: form.get("currency"),
            whatsappNumber: form.get("whatsappNumber"),
            defaultLocale: form.get("defaultLocale"),
            logoUrl,
            bannerUrl
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
      <p className="text-xs text-[var(--muted)] md:col-span-2">Logo: You can paste an image URL or choose from gallery/device. If both are provided, uploaded file is used.</p>
      <input
        defaultValue={restaurant.bannerUrl ?? ""}
        name="bannerUrl"
        placeholder="Banner URL (https://...)"
        className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2"
      />
      <input
        name="bannerFile"
        type="file"
        accept="image/*"
        className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 md:col-span-2"
      />
      <p className="text-xs text-[var(--muted)] md:col-span-2">Banner: You can paste an image URL or choose from gallery/device. If both are provided, uploaded file is used.</p>
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
