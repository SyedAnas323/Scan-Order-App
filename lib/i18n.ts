import { Dictionary, Locale } from "@/lib/types";
export type { Locale } from "@/lib/types";

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    common: {
      appName: "SofraQR",
      login: "Login",
      signup: "Sign up",
      dashboard: "Dashboard",
      menu: "Menu",
      tables: "Tables",
      settings: "Settings",
      logout: "Logout",
      save: "Save",
      cancel: "Cancel",
      skipToContent: "Skip to content",
      startTrial: "Start Free Trial",
      getStarted: "Get Started",
      language: "Language"
    },
    landing: {
      badge: "No app required. Just scan, browse, and order.",
      headline: "Digital restaurant menus that turn table QR scans into WhatsApp orders.",
      subheadline:
        "Restaurants sign up, activate monthly billing with Paddle, build their menu, create table QR codes, and start receiving orders on WhatsApp instantly.",
      stat1: "Mobile-first menu for every restaurant page",
      stat2: "One QR per table with a dedicated restaurant URL",
      stat3: "Multilingual customer journey with WhatsApp checkout",
      featuresTitle: "What restaurants get",
      feature1Title: "Subscription gated onboarding",
      feature1Text: "Owners only complete signup after a successful Paddle subscription payment.",
      feature2Title: "Menu + table control",
      feature2Text: "Create categories, add items, manage availability, and generate QR codes for every table.",
      feature3Title: "Simple customer flow",
      feature3Text: "Customers scan, browse, add items, and send their order through WhatsApp without installing anything.",
      howTitle: "How it works",
      how1: "Restaurant registers and completes subscription payment.",
      how2: "Dashboard opens for menu setup, table creation, and QR downloads.",
      how3: "Customers scan the table QR and place their order on WhatsApp.",
      pricingTitle: "Monthly subscription",
      pricingText: "Use Paddle Billing for a recurring plan and activate accounts only after payment confirmation."
    },
    auth: {
      welcome: "Launch your QR ordering flow in minutes",
      loginTitle: "Restaurant login",
      signupTitle: "Create restaurant account",
      email: "Email",
      password: "Password",
      ownerName: "Owner name",
      restaurantName: "Restaurant name",
      whatsapp: "WhatsApp number",
      submitLogin: "Login to dashboard",
      submitSignup: "Create account & continue to payment",
      paymentNote: "Signup remains pending until Paddle confirms the monthly subscription.",
      payNow: "Activate subscription"
    },
    dashboard: {
      overviewTitle: "Restaurant control room",
      onboardingPending: "Subscription pending",
      onboardingDone: "Subscription active",
      menuItems: "Menu items",
      tablesCount: "Tables",
      publicMenu: "Public menu",
      addCategory: "Add category",
      addItem: "Add menu item",
      addTable: "Add table",
      profileTitle: "Restaurant profile",
      currency: "Currency",
      slug: "Slug",
      dedicatedUrl: "Dedicated menu URL",
      setupHint: "Keep the menu simple, visual, and mobile-friendly so scan-to-order feels instant.",
      qrHint: "Each table gets its own QR code linked to the restaurant page and table number."
    },
    customer: {
      unavailable: "Unavailable",
      addToCart: "Add to cart",
      orderOnWhatsApp: "Order on WhatsApp",
      table: "Table",
      total: "Total",
      emptyCart: "No items selected yet.",
      browseMenu: "Browse menu"
    }
  },
  ur: {
    common: {
      appName: "SofraQR",
      login: "لاگ ان",
      signup: "سائن اپ",
      dashboard: "ڈیش بورڈ",
      menu: "مینو",
      tables: "ٹیبلز",
      settings: "سیٹنگز",
      logout: "لاگ آؤٹ",
      save: "محفوظ کریں",
      cancel: "منسوخ",
      skipToContent: "مواد پر جائیں",
      startTrial: "فری ٹرائل شروع کریں",
      getStarted: "شروع کریں",
      language: "زبان"
    },
    landing: {
      badge: "کوئی ایپ درکار نہیں، صرف اسکین کریں اور آرڈر دیں",
      headline: "ریسٹورنٹس کے لیے QR مینو جو WhatsApp آرڈرز میں بدل جائے۔",
      subheadline:
        "ریسٹورنٹ سائن اپ کرے، Paddle سے ماہانہ سبسکرپشن ایکٹیویٹ کرے، مینو بنائے، ٹیبل QR تیار کرے اور فوراً WhatsApp پر آرڈرز وصول کرے۔",
      stat1: "ہر ریسٹورنٹ کے لیے موبائل فرینڈلی مینو",
      stat2: "ہر ٹیبل کے لیے الگ QR اور dedicated URL",
      stat3: "ملٹی لینگویج کسٹمر فلو اور WhatsApp آرڈر",
      featuresTitle: "ریسٹورنٹ کو کیا ملے گا",
      feature1Title: "پیمنٹ کے بعد مکمل سائن اپ",
      feature1Text: "Paddle سبسکرپشن کامیاب ہونے کے بعد ہی اکاؤنٹ مکمل ایکٹیویٹ ہوگا۔",
      feature2Title: "مینو اور ٹیبل کنٹرول",
      feature2Text: "کیٹیگری، آئٹمز، availability اور ہر ٹیبل کا QR ایک ہی جگہ سے مینیج کریں۔",
      feature3Title: "سادہ کسٹمر فلو",
      feature3Text: "کسٹمر QR اسکین کرے، مینو دیکھے اور WhatsApp پر آرڈر بھیج دے۔",
      howTitle: "یہ کیسے کام کرتا ہے",
      how1: "ریسٹورنٹ رجسٹر کرتا ہے اور سبسکرپشن پیمنٹ مکمل کرتا ہے۔",
      how2: "ڈیش بورڈ کھلتا ہے جہاں مینو، ٹیبلز اور QR setup ہوتا ہے۔",
      how3: "کسٹمر ٹیبل QR اسکین کر کے WhatsApp پر آرڈر بھیجتا ہے۔",
      pricingTitle: "ماہانہ سبسکرپشن",
      pricingText: "Paddle Billing کے ذریعے recurring plan چلائیں اور payment confirm ہونے پر اکاؤنٹ activate کریں۔"
    },
    auth: {
      welcome: "چند منٹ میں اپنا QR ordering system شروع کریں",
      loginTitle: "ریسٹورنٹ لاگ ان",
      signupTitle: "ریسٹورنٹ اکاؤنٹ بنائیں",
      email: "ای میل",
      password: "پاس ورڈ",
      ownerName: "مالک کا نام",
      restaurantName: "ریسٹورنٹ کا نام",
      whatsapp: "واٹس ایپ نمبر",
      submitLogin: "ڈیش بورڈ میں لاگ ان",
      submitSignup: "اکاؤنٹ بنائیں اور پیمنٹ پر جائیں",
      paymentNote: "ماہانہ سبسکرپشن کی Paddle confirmation سے پہلے signup مکمل نہیں ہوگا۔",
      payNow: "سبسکرپشن ایکٹیویٹ کریں"
    },
    dashboard: {
      overviewTitle: "ریسٹورنٹ کنٹرول روم",
      onboardingPending: "سبسکرپشن باقی ہے",
      onboardingDone: "سبسکرپشن فعال ہے",
      menuItems: "مینو آئٹمز",
      tablesCount: "ٹیبلز",
      publicMenu: "پبلک مینو",
      addCategory: "کیٹیگری شامل کریں",
      addItem: "مینو آئٹم شامل کریں",
      addTable: "ٹیبل شامل کریں",
      profileTitle: "ریسٹورنٹ پروفائل",
      currency: "کرنسی",
      slug: "سلگ",
      dedicatedUrl: "ڈیڈیکیٹڈ مینو URL",
      setupHint: "مینو سادہ، خوبصورت اور موبائل فرینڈلی رکھیں تاکہ scan-to-order فوری محسوس ہو۔",
      qrHint: "ہر ٹیبل کا الگ QR ہوگا جو ریسٹورنٹ پیج اور ٹیبل نمبر کے ساتھ لنک ہوگا۔"
    },
    customer: {
      unavailable: "دستیاب نہیں",
      addToCart: "کارٹ میں شامل کریں",
      orderOnWhatsApp: "WhatsApp پر آرڈر کریں",
      table: "ٹیبل",
      total: "کل",
      emptyCart: "ابھی کوئی آئٹم منتخب نہیں کی گئی۔",
      browseMenu: "مینو دیکھیں"
    }
  },
  ar: {
    common: {
      appName: "SofraQR",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      dashboard: "لوحة التحكم",
      menu: "القائمة",
      tables: "الطاولات",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      save: "حفظ",
      cancel: "إلغاء",
      skipToContent: "تخطي إلى المحتوى",
      startTrial: "ابدأ التجربة",
      getStarted: "ابدأ الآن",
      language: "اللغة"
    },
    landing: {
      badge: "بدون تطبيق. فقط امسح وتصفح واطلب.",
      headline: "قوائم مطاعم رقمية تحول مسح QR على الطاولة إلى طلبات واتساب.",
      subheadline:
        "يسجل المطعم، يفعّل الاشتراك الشهري عبر Paddle، ينشئ قائمته، ويولد QR لكل طاولة ليستقبل الطلبات عبر واتساب فوراً.",
      stat1: "قائمة مهيأة للجوال لكل مطعم",
      stat2: "رابط خاص وQR مستقل لكل طاولة",
      stat3: "تجربة متعددة اللغات وطلب عبر واتساب",
      featuresTitle: "ما الذي يحصل عليه المطعم",
      feature1Title: "تسجيل مرتبط بالدفع",
      feature1Text: "لا يكتمل التسجيل إلا بعد نجاح اشتراك Paddle الشهري.",
      feature2Title: "إدارة القائمة والطاولات",
      feature2Text: "أضف الأقسام والعناصر وتحكم بالتوفر وأنشئ QR لكل طاولة.",
      feature3Title: "رحلة عميل بسيطة",
      feature3Text: "يمسح العميل الرمز، يتصفح القائمة، ويرسل الطلب عبر واتساب دون تثبيت أي تطبيق.",
      howTitle: "كيف يعمل",
      how1: "يسجل المطعم ويدفع الاشتراك الشهري.",
      how2: "تفتح لوحة التحكم لإعداد القائمة والطاولات وتنزيل QR.",
      how3: "يمسح العميل رمز الطاولة ويرسل الطلب عبر واتساب.",
      pricingTitle: "اشتراك شهري",
      pricingText: "استخدم Paddle Billing لخطة متكررة وفعّل الحساب فقط بعد تأكيد الدفع."
    },
    auth: {
      welcome: "أطلق تجربة الطلب عبر QR خلال دقائق",
      loginTitle: "دخول المطعم",
      signupTitle: "إنشاء حساب مطعم",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      ownerName: "اسم المالك",
      restaurantName: "اسم المطعم",
      whatsapp: "رقم واتساب",
      submitLogin: "الدخول إلى لوحة التحكم",
      submitSignup: "إنشاء الحساب والانتقال للدفع",
      paymentNote: "يبقى التسجيل معلقاً حتى يؤكد Paddle الاشتراك الشهري.",
      payNow: "تفعيل الاشتراك"
    },
    dashboard: {
      overviewTitle: "غرفة تحكم المطعم",
      onboardingPending: "الاشتراك معلق",
      onboardingDone: "الاشتراك مفعل",
      menuItems: "عناصر القائمة",
      tablesCount: "الطاولات",
      publicMenu: "القائمة العامة",
      addCategory: "إضافة قسم",
      addItem: "إضافة عنصر",
      addTable: "إضافة طاولة",
      profileTitle: "بيانات المطعم",
      currency: "العملة",
      slug: "المعرف",
      dedicatedUrl: "رابط القائمة الخاص",
      setupHint: "اجعل القائمة بسيطة وجذابة ومتوافقة مع الجوال ليكون الطلب سريعاً.",
      qrHint: "كل طاولة تحصل على QR خاص مرتبط بالمطعم ورقم الطاولة."
    },
    customer: {
      unavailable: "غير متاح",
      addToCart: "أضف إلى السلة",
      orderOnWhatsApp: "اطلب عبر واتساب",
      table: "طاولة",
      total: "الإجمالي",
      emptyCart: "لا توجد عناصر في السلة بعد.",
      browseMenu: "تصفح القائمة"
    }
  },
  it: {
    common: {
      appName: "SofraQR",
      login: "Accedi",
      signup: "Registrati",
      dashboard: "Dashboard",
      menu: "Menu",
      tables: "Tavoli",
      settings: "Impostazioni",
      logout: "Esci",
      save: "Salva",
      cancel: "Annulla",
      skipToContent: "Vai al contenuto",
      startTrial: "Inizia prova gratuita",
      getStarted: "Inizia ora",
      language: "Lingua"
    },
    landing: {
      badge: "Nessuna app richiesta. Basta scansionare, sfogliare e ordinare.",
      headline: "Menu digitali per ristoranti che trasformano i QR dei tavoli in ordini WhatsApp.",
      subheadline:
        "I ristoranti si registrano, attivano l'abbonamento mensile con Paddle, creano il menu, generano QR per i tavoli e iniziano subito a ricevere ordini su WhatsApp.",
      stat1: "Menu mobile-first per ogni pagina del ristorante",
      stat2: "Un QR per tavolo con URL dedicato",
      stat3: "Percorso cliente multilingua con checkout WhatsApp",
      featuresTitle: "Cosa ottengono i ristoranti",
      feature1Title: "Onboarding bloccato fino al pagamento",
      feature1Text: "Il proprietario completa la registrazione solo dopo il pagamento riuscito dell'abbonamento Paddle.",
      feature2Title: "Controllo menu e tavoli",
      feature2Text: "Crea categorie, aggiungi piatti, gestisci disponibilita e genera QR per ogni tavolo.",
      feature3Title: "Esperienza cliente semplice",
      feature3Text: "Il cliente scansiona, sfoglia, aggiunge prodotti e invia l'ordine su WhatsApp senza installare nulla.",
      howTitle: "Come funziona",
      how1: "Il ristorante si registra e completa il pagamento dell'abbonamento.",
      how2: "La dashboard si apre per configurare menu, tavoli e download dei QR.",
      how3: "I clienti scansionano il QR del tavolo e inviano l'ordine su WhatsApp.",
      pricingTitle: "Abbonamento mensile",
      pricingText: "Usa Paddle Billing per un piano ricorrente e attiva gli account solo dopo la conferma del pagamento."
    },
    auth: {
      welcome: "Lancia il tuo flusso di ordini QR in pochi minuti",
      loginTitle: "Accesso ristorante",
      signupTitle: "Crea account ristorante",
      email: "Email",
      password: "Password",
      ownerName: "Nome del proprietario",
      restaurantName: "Nome del ristorante",
      whatsapp: "Numero WhatsApp",
      submitLogin: "Accedi alla dashboard",
      submitSignup: "Crea account e continua al pagamento",
      paymentNote: "La registrazione resta in sospeso finche Paddle non conferma l'abbonamento mensile.",
      payNow: "Attiva abbonamento"
    },
    dashboard: {
      overviewTitle: "Centro di controllo del ristorante",
      onboardingPending: "Abbonamento in sospeso",
      onboardingDone: "Abbonamento attivo",
      menuItems: "Piatti del menu",
      tablesCount: "Tavoli",
      publicMenu: "Menu pubblico",
      addCategory: "Aggiungi categoria",
      addItem: "Aggiungi piatto",
      addTable: "Aggiungi tavolo",
      profileTitle: "Profilo ristorante",
      currency: "Valuta",
      slug: "Slug",
      dedicatedUrl: "URL menu dedicato",
      setupHint: "Mantieni il menu semplice, visivo e mobile-friendly per rendere immediato lo scan-to-order.",
      qrHint: "Ogni tavolo ha il suo QR collegato alla pagina del ristorante e al numero del tavolo."
    },
    customer: {
      unavailable: "Non disponibile",
      addToCart: "Aggiungi al carrello",
      orderOnWhatsApp: "Ordina su WhatsApp",
      table: "Tavolo",
      total: "Totale",
      emptyCart: "Nessun articolo selezionato.",
      browseMenu: "Sfoglia menu"
    }
  }
};

export function getTranslations(locale: Locale) {
  return dictionaries[locale];
}

export function isSupportedLocale(value?: string): value is Locale {
  return value === "en" || value === "ur" || value === "ar" || value === "it";
}

export function getLocaleDirection(locale: Locale) {
  return locale === "ur" || locale === "ar" ? "rtl" : "ltr";
}

export const supportedLocales: Locale[] = ["en", "ur", "ar", "it"];
