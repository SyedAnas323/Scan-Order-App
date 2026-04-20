export type Locale = "en" | "ur" | "ar" | "it";

export type Dictionary = {
  common: {
    appName: string;
    login: string;
    signup: string;
    dashboard: string;
    menu: string;
    tables: string;
    settings: string;
    logout: string;
    save: string;
    cancel: string;
    skipToContent: string;
    startTrial: string;
    getStarted: string;
    language: string;
  };
  landing: {
    badge: string;
    headline: string;
    subheadline: string;
    stat1: string;
    stat2: string;
    stat3: string;
    featuresTitle: string;
    feature1Title: string;
    feature1Text: string;
    feature2Title: string;
    feature2Text: string;
    feature3Title: string;
    feature3Text: string;
    howTitle: string;
    how1: string;
    how2: string;
    how3: string;
    pricingTitle: string;
    pricingText: string;
  };
  auth: {
    welcome: string;
    loginTitle: string;
    signupTitle: string;
    email: string;
    password: string;
    ownerName: string;
    restaurantName: string;
    whatsapp: string;
    submitLogin: string;
    submitSignup: string;
    paymentNote: string;
    payNow: string;
  };
  dashboard: {
    overviewTitle: string;
    onboardingPending: string;
    onboardingDone: string;
    menuItems: string;
    tablesCount: string;
    publicMenu: string;
    addCategory: string;
    addItem: string;
    addTable: string;
    profileTitle: string;
    currency: string;
    slug: string;
    dedicatedUrl: string;
    setupHint: string;
    qrHint: string;
  };
  customer: {
    unavailable: string;
    addToCart: string;
    orderOnWhatsApp: string;
    table: string;
    total: string;
    emptyCart: string;
    browseMenu: string;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "restaurant";
  restaurantId: string;
  subscriptionStatus: "pending" | "active" | "canceled";
};

export type Restaurant = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  address: string;
  whatsappNumber: string;
  currency: string;
  defaultLocale: Locale;
  logoUrl?: string;
};

export type MenuCategory = {
  id: string;
  restaurantId: string;
  name: string;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  tags: string[];
};

export type Table = {
  id: string;
  restaurantId: string;
  name: string;
  number: number;
};

export type SessionPayload = {
  userId: string;
  restaurantId: string;
};

export type RestaurantOwnerRequest = {
  user: User;
  restaurant: Restaurant | null;
  createdAt: string;
};

export type OrderStatus = "pending" | "completed" | "canceled";

export type AdminOrderItem = {
  id: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type AdminOrder = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  tableName?: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  status: OrderStatus;
  totalAmount: number;
  source: string;
  createdAt: string;
  items: AdminOrderItem[];
};

export type AdminActivity = {
  id: string;
  actorType: "admin" | "restaurant_owner" | "customer";
  actorName: string;
  action: string;
  details: string;
  restaurantName?: string;
  createdAt: string;
};

export type AdminDashboardData = {
  signupRequests: RestaurantOwnerRequest[];
  recentOrders: AdminOrder[];
  recentActivity: AdminActivity[];
  onlineOwners: Array<{ id: string; name: string; restaurantName?: string; lastSeenAt: string }>;
  onlineCustomers: Array<{ id: string; name: string; restaurantName?: string; lastSeenAt: string }>;
};

export type AppData = {
  users: User[];
  restaurants: Restaurant[];
  categories: MenuCategory[];
  menuItems: MenuItem[];
  tables: Table[];
};
