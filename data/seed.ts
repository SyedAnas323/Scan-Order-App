import { AppData } from "@/lib/types";

export const seedData: AppData = {
  users: [
    {
      id: "user_demo",
      name: "Ayesha Khan",
      email: "demo@sofraqr.com",
      password: "demo1234",
      role: "restaurant",
      restaurantId: "rest_demo",
      subscriptionStatus: "active"
    }
  ],
  restaurants: [
    {
      id: "rest_demo",
      ownerId: "user_demo",
      name: "Mehfil Grill",
      slug: "mehfil-grill",
      address: "Gulberg, Lahore",
      whatsappNumber: "923464777625",
      currency: "PKR",
      defaultLocale: "en"
    }
  ],
  categories: [
    {
      id: "cat_1",
      restaurantId: "rest_demo",
      name: "Signature BBQ"
    },
    {
      id: "cat_2",
      restaurantId: "rest_demo",
      name: "Drinks"
    }
  ],
  menuItems: [
    {
      id: "item_1",
      restaurantId: "rest_demo",
      categoryId: "cat_1",
      name: "Chicken Tikka Platter",
      description: "Juicy charcoal grilled tikka with mint yogurt and naan.",
      price: 1490,
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80",
      available: true,
      tags: ["Popular", "Spicy"]
    },
    {
      id: "item_2",
      restaurantId: "rest_demo",
      categoryId: "cat_1",
      name: "Behari Boti",
      description: "Tender beef skewers marinated overnight with smoky spices.",
      price: 1680,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
      available: true,
      tags: ["Chef's Special"]
    },
    {
      id: "item_3",
      restaurantId: "rest_demo",
      categoryId: "cat_2",
      name: "Mint Lemonade",
      description: "Fresh lime, mint, and crushed ice.",
      price: 390,
      imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
      available: true,
      tags: ["Cold"]
    },
    {
      id: "item_4",
      restaurantId: "rest_demo",
      categoryId: "cat_1",
      name: "Malai Boti",
      description: "Creamy grilled chicken cubes with mild spices and charcoal aroma.",
      price: 1590,
      imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80",
      available: true,
      tags: ["Creamy", "Popular"]
    },
    {
      id: "item_5",
      restaurantId: "rest_demo",
      categoryId: "cat_1",
      name: "Chicken Seekh Kebab",
      description: "Soft and smoky seekh kebabs served with chutney and salad.",
      price: 1190,
      imageUrl: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80",
      available: true,
      tags: ["Smoky"]
    },
    {
      id: "item_6",
      restaurantId: "rest_demo",
      categoryId: "cat_1",
      name: "Mutton Chops",
      description: "Tender mutton chops marinated in house spices and flame grilled.",
      price: 2390,
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
      available: true,
      tags: ["Premium", "Chef's Special"]
    },
    {
      id: "item_7",
      restaurantId: "rest_demo",
      categoryId: "cat_1",
      name: "Grilled Fish Fillet",
      description: "Fresh fish fillet with lemon butter glaze and herb seasoning.",
      price: 1890,
      imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80",
      available: true,
      tags: ["Fresh"]
    },
    {
      id: "item_8",
      restaurantId: "rest_demo",
      categoryId: "cat_2",
      name: "Peach Iced Tea",
      description: "Chilled peach tea with citrus notes and crushed ice.",
      price: 420,
      imageUrl: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=900&q=80",
      available: true,
      tags: ["Refreshing"]
    },
    {
      id: "item_9",
      restaurantId: "rest_demo",
      categoryId: "cat_2",
      name: "Fresh Lime",
      description: "Classic sweet and salty fresh lime soda for a quick cool-down.",
      price: 310,
      imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
      available: true,
      tags: ["Classic"]
    },
    {
      id: "item_10",
      restaurantId: "rest_demo",
      categoryId: "cat_2",
      name: "Mineral Water",
      description: "Chilled bottled mineral water.",
      price: 120,
      imageUrl: "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=900&q=80",
      available: true,
      tags: ["Essential"]
    }
  ],
  tables: [
    {
      id: "table_1",
      restaurantId: "rest_demo",
      name: "Table 1",
      number: 1
    },
    {
      id: "table_2",
      restaurantId: "rest_demo",
      name: "Table 2",
      number: 2
    }
  ]
};
