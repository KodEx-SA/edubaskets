import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.order.deleteMany();
  await prisma.hamperItem.deleteMany();
  await prisma.hamper.deleteMany();
  await prisma.vendorAnalytics.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Hash password for test users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: "admin@edubaskets.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      phoneNumber: "0123456789",
      isActive: true,
    },
  });
  console.log("✅ Admin user created");

  // 2. Create Vendor Users
  const vendor1User = await prisma.user.create({
    data: {
      email: "vendor1@demo.com",
      name: "Campus Mini-Mart Owner",
      password: hashedPassword,
      role: "VENDOR",
      phoneNumber: "0821234567",
      isActive: true,
    },
  });

  const vendor1 = await prisma.vendor.create({
    data: {
      userId: vendor1User.id,
      businessName: "Campus Mini-Mart",
      businessAddress: "123 University Avenue, Rustenburg, 0299",
      businessPhone: "0821234567",
      description: "Your one-stop shop for all campus essentials!",
      logo: "/placeholder-vendor1.png",
      status: "APPROVED",
      rating: 4.5,
      totalRatings: 120,
      approvedAt: new Date(),
    },
  });

  await prisma.vendorAnalytics.create({
    data: {
      vendorId: vendor1.id,
      totalOrders: 87,
      totalRevenue: 13050.0,
      averageRating: 4.5,
      completedOrders: 82,
      cancelledOrders: 5,
    },
  });

  const vendor2User = await prisma.user.create({
    data: {
      email: "vendor2@demo.com",
      name: "Smart Eats Owner",
      password: hashedPassword,
      role: "VENDOR",
      phoneNumber: "0827654321",
      isActive: true,
    },
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      userId: vendor2User.id,
      businessName: "Smart Eats",
      businessAddress: "456 Campus Road, Rustenburg, 0299",
      businessPhone: "0827654321",
      description: "Healthy meals and snacks for busy students",
      logo: "/placeholder-vendor2.png",
      status: "APPROVED",
      rating: 4.7,
      totalRatings: 95,
      approvedAt: new Date(),
    },
  });

  await prisma.vendorAnalytics.create({
    data: {
      vendorId: vendor2.id,
      totalOrders: 63,
      totalRevenue: 9450.0,
      averageRating: 4.7,
      completedOrders: 60,
      cancelledOrders: 3,
    },
  });

  console.log("✅ Vendor users created");

  // 3. Create Student Users
  const students = [];
  for (let i = 1; i <= 5; i++) {
    const student = await prisma.user.create({
      data: {
        email: `student${i}@demo.com`,
        name: `Student ${i}`,
        password: hashedPassword,
        role: "STUDENT",
        phoneNumber: `081234567${i}`,
        isActive: true,
      },
    });
    students.push(student);
  }
  console.log("✅ Student users created");

  // 4. Create Hampers for Vendor 1
  const hamper1 = await prisma.hamper.create({
    data: {
      vendorId: vendor1.id,
      name: "Late Night Study Pack",
      description:
        "Fuel your late-night study sessions! Packed with snacks and essentials to keep you focused.",
      category: "FOOD_GROCERIES",
      price: 150.0,
      compareAtPrice: 180.0,
      stock: 25,
      isAvailable: true,
      images: ["/placeholder-hamper1.jpg"],
      tags: ["food", "study", "snacks", "popular"],
      viewCount: 1250,
      orderCount: 45,
      rating: 4.7,
      totalRatings: 45,
      items: {
        create: [
          {
            name: "Instant Noodles",
            quantity: 4,
            description: "Assorted flavors",
          },
          { name: "Energy Drink", quantity: 2, description: "250ml cans" },
          {
            name: "Pen/Highlighter Set",
            quantity: 1,
            description: "Assorted colors",
          },
          {
            name: "Chocolate Bar",
            quantity: 2,
            description: "Indulgent chocolate",
          },
        ],
      },
    },
  });

  const hamper2 = await prisma.hamper.create({
    data: {
      vendorId: vendor1.id,
      name: "Essential Hygiene Kit",
      description:
        "Complete hygiene essentials for students. Stay fresh and clean!",
      category: "HYGIENE_CARE",
      price: 180.0,
      compareAtPrice: 220.0,
      stock: 30,
      isAvailable: true,
      images: ["/placeholder-hamper2.jpg"],
      tags: ["hygiene", "toiletries", "essentials"],
      viewCount: 890,
      orderCount: 32,
      rating: 4.6,
      totalRatings: 32,
      items: {
        create: [
          { name: "Toothpaste", quantity: 1, description: "75ml tube" },
          { name: "Soap", quantity: 2, description: "125g bars" },
          { name: "Shampoo", quantity: 1, description: "200ml bottle" },
          { name: "Deodorant", quantity: 1, description: "Roll-on" },
        ],
      },
    },
  });

  const hamper3 = await prisma.hamper.create({
    data: {
      vendorId: vendor1.id,
      name: "Study Essentials Kit",
      description: "Everything you need for effective studying",
      category: "STUDY_ESSENTIALS",
      price: 120.0,
      stock: 20,
      isAvailable: true,
      images: ["/placeholder-hamper3.jpg"],
      tags: ["study", "stationery", "academic"],
      viewCount: 645,
      orderCount: 28,
      rating: 4.8,
      totalRatings: 28,
      items: {
        create: [
          { name: "Notebooks", quantity: 3, description: "A4 ruled" },
          { name: "Pens", quantity: 10, description: "Blue and black" },
          { name: "Highlighters", quantity: 5, description: "Assorted colors" },
          { name: "Sticky Notes", quantity: 2, description: "Multi-pack" },
        ],
      },
    },
  });

  // 5. Create Hampers for Vendor 2
  const hamper4 = await prisma.hamper.create({
    data: {
      vendorId: vendor2.id,
      name: "Healthy Meal Pack",
      description: "Nutritious meals for health-conscious students",
      category: "FOOD_GROCERIES",
      price: 200.0,
      stock: 15,
      isAvailable: true,
      images: ["/placeholder-hamper4.jpg"],
      tags: ["food", "healthy", "nutrition"],
      viewCount: 520,
      orderCount: 22,
      rating: 4.9,
      totalRatings: 22,
      items: {
        create: [
          { name: "Protein Bars", quantity: 5, description: "Mixed flavors" },
          {
            name: "Fruit Pack",
            quantity: 1,
            description: "Fresh seasonal fruits",
          },
          { name: "Nuts Mix", quantity: 2, description: "100g packs" },
          {
            name: "Whole Grain Crackers",
            quantity: 2,
            description: "Healthy snacks",
          },
        ],
      },
    },
  });

  console.log("✅ Hampers created");

  // 6. Create Sample Orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2025-0001",
      userId: students[0].id,
      studentName: students[0].name!,
      studentEmail: students[0].email,
      studentPhone: students[0].phoneNumber!,
      vendorId: vendor1.id,
      deliveryAddress: "Campus Dorm B, Room 301",
      status: "DELIVERED",
      subtotal: 150.0,
      deliveryFee: 25.0,
      serviceFee: 7.5,
      total: 182.5,
      deliveredAt: new Date(),
      items: {
        create: [
          {
            hamperId: hamper1.id,
            quantity: 1,
            price: 150.0,
            subtotal: 150.0,
            hamperName: hamper1.name,
            hamperDescription: hamper1.description,
            hamperImage: hamper1.images[0],
          },
        ],
      },
      payment: {
        create: {
          amount: 182.5,
          status: "COMPLETED",
          method: "CREDIT_CARD",
          transactionId: "PF12345",
          completedAt: new Date(),
        },
      },
    },
  });

  console.log("✅ Sample orders created");

  // 7. Create App Settings
  await prisma.appSettings.createMany({
    data: [
      {
        key: "delivery_fee_base",
        value: "25",
        description: "Base delivery fee (ZAR)",
      },
      {
        key: "delivery_fee_per_km",
        value: "5",
        description: "Per-km delivery charge (ZAR)",
      },
      {
        key: "service_fee_percentage",
        value: "5",
        description: "Platform commission (%)",
      },
      {
        key: "free_delivery_threshold",
        value: "250",
        description: "Free delivery over this amount (ZAR)",
      },
    ],
  });

  console.log("✅ App settings created");

  console.log("🎉 Seeding complete!");
  console.log("");
  console.log("📝 Test Accounts:");
  console.log("Admin: admin@edubaskets.com / password123");
  console.log("Vendor 1: vendor1@demo.com / password123");
  console.log("Vendor 2: vendor2@demo.com / password123");
  console.log("Students: student1@demo.com to student5@demo.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
