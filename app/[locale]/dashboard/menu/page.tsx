import Image from "next/image";
import { AddCategoryForm, AddMenuItemForm, MenuItemEditor } from "@/components/dashboard-forms";
import { requireSession } from "@/lib/auth";
import { getRestaurantBundleByUserId } from "@/lib/data-store";
import { getTranslations, type Locale } from "@/lib/i18n";
import { MenuCategory, MenuItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const menuUi = {
  en: {
    createCategories: "Create categories",
    addMenuItem: "Add menu item",
    categoryName: "Category name",
    add: "Add",
    itemCount: "items",
    available: "Available",
    unavailable: "Unavailable",
    noItems: "No items in this category yet.",
    selectCategory: "Select category",
    itemName: "Item name",
    description: "Description",
    price: "Price",
    imageUrl: "Image URL",
    tags: "Popular, Spicy",
    addItem: "Add item",
    saveChanges: "Save changes",
    saving: "Saving...",
    uploadHint: "You can paste an image URL or upload from device. If both are provided, uploaded file is used.",
    edit: "Edit",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete this menu item?",
    cancel: "Cancel"
  },
  ur: {
    createCategories: "کیٹیگری بنائیں",
    addMenuItem: "مینو آئٹم شامل کریں",
    categoryName: "کیٹیگری کا نام",
    add: "شامل کریں",
    itemCount: "آئٹمز",
    available: "دستیاب",
    unavailable: "دستیاب نہیں",
    noItems: "اس کیٹیگری میں ابھی کوئی آئٹم نہیں۔",
    selectCategory: "کیٹیگری منتخب کریں",
    itemName: "آئٹم کا نام",
    description: "تفصیل",
    price: "قیمت",
    imageUrl: "تصویر URL",
    tags: "مقبول، اسپائسی",
    addItem: "آئٹم شامل کریں",
    saveChanges: "تبدیلیاں محفوظ کریں",
    saving: "محفوظ کیا جا رہا ہے...",
    uploadHint: "آپ URL دے سکتے ہیں یا ڈیوائس سے تصویر اپلوڈ کر سکتے ہیں۔ دونوں میں اپلوڈ تصویر استعمال ہوگی۔",
    edit: "ترمیم",
    delete: "حذف کریں",
    deleteConfirm: "کیا آپ واقعی اس آئٹم کو حذف کرنا چاہتے ہیں؟",
    cancel: "منسوخ"
  },
  ar: {
    createCategories: "إنشاء الأقسام",
    addMenuItem: "إضافة عنصر قائمة",
    categoryName: "اسم القسم",
    add: "إضافة",
    itemCount: "عناصر",
    available: "متاح",
    unavailable: "غير متاح",
    noItems: "لا توجد عناصر في هذا القسم بعد.",
    selectCategory: "اختر القسم",
    itemName: "اسم العنصر",
    description: "الوصف",
    price: "السعر",
    imageUrl: "رابط الصورة",
    tags: "مميز، حار",
    addItem: "إضافة عنصر",
    saveChanges: "حفظ التغييرات",
    saving: "جارٍ الحفظ...",
    uploadHint: "يمكنك إدخال رابط صورة أو رفع صورة من الجهاز. إذا تم إدخال الاثنين فسيتم استخدام الصورة المرفوعة.",
    edit: "تعديل",
    delete: "حذف",
    deleteConfirm: "هل أنت متأكد من حذف هذا العنصر؟",
    cancel: "إلغاء"
  },
  it: {
    createCategories: "Crea categorie",
    addMenuItem: "Aggiungi piatto",
    categoryName: "Nome categoria",
    add: "Aggiungi",
    itemCount: "elementi",
    available: "Disponibile",
    unavailable: "Non disponibile",
    noItems: "Nessun elemento in questa categoria.",
    selectCategory: "Seleziona categoria",
    itemName: "Nome piatto",
    description: "Descrizione",
    price: "Prezzo",
    imageUrl: "URL immagine",
    tags: "Popolare, Piccante",
    addItem: "Aggiungi elemento",
    saveChanges: "Salva modifiche",
    saving: "Salvataggio...",
    uploadHint: "Puoi incollare un URL immagine o caricare dal dispositivo. Se inserisci entrambi, viene usato il file caricato.",
    edit: "Modifica",
    delete: "Elimina",
    deleteConfirm: "Vuoi davvero eliminare questo elemento?",
    cancel: "Annulla"
  }
} as const;

export default async function DashboardMenuPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const session = await requireSession();
  const bundle = await getRestaurantBundleByUserId(session.userId);
  if (!bundle) {
    return null;
  }
  const t = getTranslations(locale);
  const text = menuUi[locale];

  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6">
        <h2 className="text-2xl font-bold">{text.createCategories}</h2>
        <div className="mt-4">
          <AddCategoryForm labels={{ categoryName: text.categoryName, add: text.add, saving: text.saving }} />
        </div>
      </section>
      <section className="glass rounded-[2rem] p-6">
        <h2 className="text-2xl font-bold">{text.addMenuItem}</h2>
        <div className="mt-4">
          <AddMenuItemForm
            categories={bundle.categories}
            labels={{
              selectCategory: text.selectCategory,
              itemName: text.itemName,
              description: text.description,
              price: text.price,
              imageUrl: text.imageUrl,
              tags: text.tags,
              addItem: text.addItem,
              saveChanges: text.saveChanges,
              saving: text.saving,
              uploadHint: text.uploadHint,
              edit: text.edit,
              delete: text.delete,
              deleteConfirm: text.deleteConfirm,
              cancel: t.common.cancel,
              available: text.available
            }}
          />
        </div>
      </section>
      <section className="space-y-4">
        {bundle.categories.map((category: MenuCategory) => {
          const items = bundle.menuItems.filter((item: MenuItem) => item.categoryId === category.id);
          return (
            <article key={category.id} className="glass rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold">{category.name}</h3>
                <span className="pill">{items.length} {text.itemCount}</span>
              </div>
              <div className="mt-4 grid gap-4">
                {items.length ? (
                  items.map((item: MenuItem) => (
                    <div key={item.id} className="grid gap-4 rounded-[1.5rem] bg-white/75 p-4 md:grid-cols-[120px_1fr_auto] md:items-center">
                      <div className="relative min-h-28 overflow-hidden rounded-[1.2rem]">
                        {item.imageUrl ? <Image src={item.imageUrl} alt={item.name} fill className="object-cover" /> : <div className="flex h-full items-center justify-center bg-[var(--accent)]/30 font-semibold">{item.name}</div>}
                      </div>
                      <div>
                        <div className="text-lg font-bold">{item.name}</div>
                        <p className="mt-1 text-sm text-[var(--muted)]">{item.description}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="text-lg font-bold">{formatCurrency(item.price, bundle.restaurant.currency)}</div>
                        <div className="mt-2 text-sm text-[var(--muted)]">{item.available ? text.available : text.unavailable}</div>
                      </div>
                      <div className="md:col-span-3">
                        <MenuItemEditor
                          item={item}
                          categories={bundle.categories}
                          labels={{
                            selectCategory: text.selectCategory,
                            itemName: text.itemName,
                            description: text.description,
                            price: text.price,
                            imageUrl: text.imageUrl,
                            tags: text.tags,
                            addItem: text.addItem,
                            saveChanges: text.saveChanges,
                            saving: text.saving,
                            uploadHint: text.uploadHint,
                            edit: text.edit,
                            delete: text.delete,
                            deleteConfirm: text.deleteConfirm,
                            cancel: text.cancel,
                            available: text.available
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] px-4 py-6 text-sm text-[var(--muted)]">{text.noItems}</div>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
