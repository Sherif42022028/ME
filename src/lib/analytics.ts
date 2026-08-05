import { prisma } from "./prisma";
import { OrderStatus, PaymentStatus, EventType } from "@prisma/client";

export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
  preset?: "7d" | "30d" | "90d" | "6m" | "1y" | "custom";
}

export function getDateRangeFromPreset(preset: string = "30d"): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const startDate = new Date();

  switch (preset) {
    case "7d":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(endDate.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(endDate.getDate() - 90);
      break;
    case "6m":
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case "1y":
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
      break;
  }

  return { startDate, endDate };
}

/**
 * Calculates Dashboard Overview KPIs strictly from Neon DB records.
 */
export async function getDashboardOverviewStats() {
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Revenue computations
  const [todayRev, weekRev, monthRev, yearRev, prevMonthRev] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: PaymentStatus.PAID, createdAt: { gte: startOfToday } },
      _sum: { totalAmount: true },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: PaymentStatus.PAID, createdAt: { gte: startOfWeek } },
      _sum: { totalAmount: true },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: PaymentStatus.PAID, createdAt: { gte: startOfMonth } },
      _sum: { totalAmount: true },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: PaymentStatus.PAID, createdAt: { gte: startOfYear } },
      _sum: { totalAmount: true },
    }),
    prisma.order.aggregate({
      where: {
        paymentStatus: PaymentStatus.PAID,
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
          lt: startOfMonth,
        },
      },
      _sum: { totalAmount: true },
    }),
  ]);

  const currentMonthRevenue = monthRev._sum.totalAmount || 0;
  const previousMonthRevenue = prevMonthRev._sum.totalAmount || 0;
  const revenueGrowthPercentage =
    previousMonthRevenue > 0
      ? Number((((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100).toFixed(1))
      : 0;

  // Order Counts
  const [todayOrdersCount, pendingOrdersCount, processingOrdersCount, shippedOrdersCount, deliveredOrdersCount, cancelledOrdersCount] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
      prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
      prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
    ]);

  // Customer Counts
  const [totalCustomersCount, newCustomersCount] = await Promise.all([
    prisma.customer.count(),
    prisma.customer.count({ where: { createdAt: { gte: startOfMonth } } }),
  ]);

  // Product Inventory Counts
  const [totalProductsCount, availableProductsCount, soldProductsCount, lowStockProductsCount, outOfStockProductsCount] =
    await Promise.all([
      prisma.product.count({ where: { status: { not: "ARCHIVED" } } }),
      prisma.product.count({ where: { stock: { gt: 1 }, status: "PUBLISHED" } }),
      prisma.product.count({ where: { status: "SOLD" } }),
      prisma.product.count({ where: { stock: 1, status: "PUBLISHED" } }),
      prisma.product.count({ where: { stock: 0 } }),
    ]);

  // First-party Analytics Funnel Events
  const [visitorsCount, productViewsCount, addToCartCount, checkoutStartedCount, completedPurchasesCount] =
    await Promise.all([
      prisma.analyticsEvent.groupBy({ by: ["sessionId"], _count: { sessionId: true } }).then((res) => res.length),
      prisma.analyticsEvent.count({ where: { eventType: EventType.PRODUCT_VIEW } }),
      prisma.analyticsEvent.count({ where: { eventType: EventType.ADD_TO_CART } }),
      prisma.analyticsEvent.count({ where: { eventType: EventType.CHECKOUT_STARTED } }),
      prisma.analyticsEvent.count({ where: { eventType: EventType.PURCHASE } }),
    ]);

  const conversionRate =
    visitorsCount > 0 ? Number(((completedPurchasesCount / visitorsCount) * 100).toFixed(2)) : 0;

  return {
    revenue: {
      today: todayRev._sum.totalAmount || 0,
      week: weekRev._sum.totalAmount || 0,
      month: currentMonthRevenue,
      year: yearRev._sum.totalAmount || 0,
      growthPercentage: revenueGrowthPercentage,
    },
    orders: {
      today: todayOrdersCount,
      pending: pendingOrdersCount,
      processing: processingOrdersCount,
      shipped: shippedOrdersCount,
      delivered: deliveredOrdersCount,
      cancelled: cancelledOrdersCount,
      total: todayOrdersCount + pendingOrdersCount + processingOrdersCount + shippedOrdersCount + deliveredOrdersCount,
    },
    customers: {
      total: totalCustomersCount,
      newThisMonth: newCustomersCount,
      returning: Math.max(0, totalCustomersCount - newCustomersCount),
    },
    products: {
      total: totalProductsCount,
      available: availableProductsCount,
      sold: soldProductsCount,
      lowStock: lowStockProductsCount,
      outOfStock: outOfStockProductsCount,
    },
    conversion: {
      visitors: visitorsCount,
      productViews: productViewsCount,
      addToCart: addToCartCount,
      checkoutStarted: checkoutStartedCount,
      completedPurchases: completedPurchasesCount,
      rate: conversionRate,
    },
  };
}

/**
 * Computes Revenue Chart timeline data for a selected date range.
 */
export async function getRevenueTimelineData(preset: string = "30d") {
  const { startDate, endDate } = getDateRangeFromPreset(preset);

  const orders = await prisma.order.findMany({
    where: {
      paymentStatus: PaymentStatus.PAID,
      createdAt: { gte: startDate, lte: endDate },
    },
    select: {
      totalAmount: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Group by date (YYYY-MM-DD)
  const grouped: Record<string, { date: string; revenue: number; ordersCount: number }> = {};

  // Pre-fill date slots
  const curr = new Date(startDate);
  while (curr <= endDate) {
    const key = curr.toISOString().split("T")[0];
    grouped[key] = { date: key, revenue: 0, ordersCount: 0 };
    curr.setDate(curr.getDate() + 1);
  }

  orders.forEach((ord) => {
    const key = ord.createdAt.toISOString().split("T")[0];
    if (grouped[key]) {
      grouped[key].revenue += ord.totalAmount;
      grouped[key].ordersCount += 1;
    }
  });

  const chartData = Object.values(grouped).map((item) => ({
    ...item,
    aov: item.ordersCount > 0 ? Math.round(item.revenue / item.ordersCount) : 0,
  }));

  const totalRev = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOrders = chartData.reduce((acc, curr) => acc + curr.ordersCount, 0);
  const overallAov = totalOrders > 0 ? Math.round(totalRev / totalOrders) : 0;

  return {
    chartData,
    totalRevenue: totalRev,
    totalOrders,
    averageOrderValue: overallAov,
  };
}

/**
 * Traffic sources distribution
 */
export async function getTrafficSourcesData() {
  const sources = await prisma.analyticsEvent.groupBy({
    by: ["source"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  const totalEvents = sources.reduce((acc, s) => acc + s._count.id, 0);

  return sources.map((s) => ({
    name: s.source || "Direct",
    count: s._count.id,
    percentage: totalEvents > 0 ? Math.round((s._count.id / totalEvents) * 100) : 0,
  }));
}
