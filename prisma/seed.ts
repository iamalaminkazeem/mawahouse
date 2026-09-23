import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Site settings ---
  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      hours: {
        monday: { open: "12:30 PM", close: "10:00 PM", closed: false },
        tuesday: { open: "12:30 PM", close: "10:00 PM", closed: false },
        wednesday: { open: "12:30 PM", close: "10:00 PM", closed: false },
        thursday: { open: "12:30 PM", close: "10:00 PM", closed: false },
        friday: { open: "12:30 PM", close: "10:00 PM", closed: false },
        saturday: { open: "12:30 PM", close: "10:00 PM", closed: false },
        sunday: { open: "12:30 PM", close: "10:00 PM", closed: false },
      },
      deliveryEnabled: false, // off until client configures a delivery fee in /admin/ordering
      deliveryFee: null, // not yet configured — admin must set this in /admin/ordering
      taxEnabled: false,
    },
  });

  await prisma.orderCounter.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main", lastSeq: 0 },
  });

  // --- Admin user (CHANGE THIS PASSWORD after first login) ---
  const passwordHash = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!",
    10
  );
  await prisma.adminUser.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL || "admin@mawahouse.com" },
    update: {},
    create: {
      email: process.env.SEED_ADMIN_EMAIL || "admin@mawahouse.com",
      passwordHash,
      name: "MaWa House Admin",
    },
  });

  // --- Categories ---
  const categoryDefs = [
    { name: "Breakfast / Brunch", slug: "breakfast", section: "breakfast", sortOrder: 0 },
    { name: "Lunch", slug: "lunch", section: "lunch", sortOrder: 1 },
    { name: "Dinner", slug: "dinner", section: "dinner", sortOrder: 2 },
    { name: "Starters", slug: "starters", section: "starters", sortOrder: 3 },
    { name: "Main Dishes", slug: "main-dishes", section: "main", sortOrder: 4 },
    { name: "Our Dishes", slug: "our-dishes", section: "main", sortOrder: 5 },
    { name: "Drinks", slug: "drinks", section: "drinks", sortOrder: 6 },
    { name: "Specials", slug: "specials-menu", section: "specials", sortOrder: 7 },
    { name: "Buffet", slug: "buffet-menu", section: "buffet", sortOrder: 8 },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoryDefs) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categories[c.slug] = created.id;
  }

  // --- Starters ---
  await prisma.menuItem.createMany({
    data: [
      { name: "Fried Plantain", price: 6.99, categoryId: categories["starters"], sortOrder: 0 },
      { name: "Pepper Kala / PuffPuff", price: 4.99, categoryId: categories["starters"], sortOrder: 1 },
      { name: "Meat Pie", price: 3.99, categoryId: categories["starters"], sortOrder: 2 },
      { name: "Fish Pie", price: 4.99, categoryId: categories["starters"], sortOrder: 3 },
      { name: "Roasted Meat", price: 4.99, categoryId: categories["starters"], sortOrder: 4 },
    ],
    skipDuplicates: true,
  });

  // --- Drinks ---
  await prisma.menuItem.createMany({
    data: [
      { name: "Vimto", price: 2.99, categoryId: categories["drinks"], sortOrder: 0 },
      { name: "Coca Cola", price: 2.5, categoryId: categories["drinks"], sortOrder: 1 },
      { name: "Sprite", price: 2.5, categoryId: categories["drinks"], sortOrder: 2 },
      { name: "Fanta (Orange)", price: 2.5, categoryId: categories["drinks"], sortOrder: 3 },
      { name: "Malt", price: 1.99, categoryId: categories["drinks"], sortOrder: 4 },
      { name: "Water", price: 1.99, categoryId: categories["drinks"], sortOrder: 5 },
      {
        name: "Beets & Green Machine",
        description: "8 oz",
        price: 9.99,
        categoryId: categories["drinks"],
        sortOrder: 6,
      },
    ],
    skipDuplicates: true,
  });

  // --- Main Dishes (created individually so we can attach seafood add-ons below) ---
  const mainDishDefs = [
    {
      name: "Egusi Soup + Fufu",
      description: "Cooked with chicken and smoked turkey",
      price: 24.99,
      sortOrder: 0,
    },
    {
      name: "Liberian Dry Rice + Whole Fish",
      description:
        "Choose to add sardine, corn beef, luncheon meat (chicken), boiled egg, red palm oil, pepper sauce",
      price: 24.99,
      sortOrder: 1,
    },
    {
      name: "Cassava Leaves + Rice",
      description: "Cooked with chicken and smoked turkey",
      price: 24.99,
      sortOrder: 2,
    },
    {
      name: "Palm Butter + Rice",
      description: "Cooked with chicken and smoked turkey",
      price: 24.99,
      sortOrder: 3,
    },
    {
      name: "Pepper Soup + Fufu",
      description: "Cooked with chicken and smoked turkey",
      price: 24.99,
      sortOrder: 4,
    },
    {
      name: "Jollof Rice + Chicken",
      price: 24.99,
      sortOrder: 5,
    },
    {
      name: "Attieke + Whole Fish",
      description: "Comes with pepper sauce, fried plantains, onions, cucumbers, tomatoes",
      price: 24.99,
      sortOrder: 6,
    },
  ];

  for (const dish of mainDishDefs) {
    const existing = await prisma.menuItem.findFirst({
      where: { name: dish.name, categoryId: categories["main-dishes"] },
    });
    const item =
      existing ||
      (await prisma.menuItem.create({
        data: { ...dish, categoryId: categories["main-dishes"] },
      }));

    // Seafood add-ons, per the flyer, apply as optional add-ons on main dishes
    await prisma.addOn.createMany({
      data: [
        { name: "Add Fish", price: 3, menuItemId: item.id, sortOrder: 0 },
        { name: "Add Shrimp", price: 3, menuItemId: item.id, sortOrder: 1 },
        { name: "Add Crab", price: 5, menuItemId: item.id, sortOrder: 2 },
      ],
      skipDuplicates: true,
    });
  }

  // --- Our Dishes (no prices given on flyer — admin should fill these in) ---
  const ourDishes = [
    "Cassava Gravy",
    "Potato Green",
    "Cassava Leaves",
    "Check Rice & Gravy",
    "Roasted Meat",
    "Goat Soup",
    "Palm Butter",
    "Red Oil Okra",
    "Dry Rice",
    "Fried Rice",
    "Pepper Soup",
    "Peanut Soup",
  ];
  await prisma.menuItem.createMany({
    data: ourDishes.map((name, i) => ({
      name,
      price: 0, // placeholder — no price on flyer, admin must set this
      available: false, // hidden publicly until admin sets a real price
      categoryId: categories["our-dishes"],
      sortOrder: i,
      notes: "Price not listed on original flyer — set price and mark available in admin.",
    })),
    skipDuplicates: true,
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
