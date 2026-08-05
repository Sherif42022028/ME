import { prisma } from "./prisma";
import { OrderStatus } from "@prisma/client";

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
  Confirmed Sales Statuses: CONFIRMED, PROCESSING, SHIPPED, DELIVERED
 */
const CONFIRMED_SALE_STATUSES: OrderStatus[] = [
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

/**
 * Calculates Dashboard Overview KPIs strictly from Neon DB records.
 */
export async function getDashboardOverviewStats() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Fetch all confirmed sales orders with their items to compute Revenue & COGS
  const confirmedOrders = await prisma.order.findMany({
    where: {
      status: { in: CONFIRMED_SALE_STATUSES },
    },
    include: {
      items: true,
    },
  });

  let totalRevenue = 0;
  let totalCOGS = 0;
  let totalDiscounts = 0;

  confirmedOrders.forEach((ord) => {
    totalRevenue += ord.subtotal || ord.totalAmount || 0;
    totalDiscounts += ord.discountAmount || 0;
    ord.items.forEach((item) => {
      totalCOGS += (item.costPrice || 15.0) * item.quantity;
    });
  });

  const grossProfit = totalRevenue - totalCOGS;

  // 2. Fetch Operating Expenses from Expense model
  const expenseAgg = await prisma.expense.aggregate({
    _sum: { amount: true },
  });
  const operatingExpenses = expenseAgg._sum.amount || 0;

  // 3. Net Profit & Margin
  const netProfit = grossProfit - operatingExpenses - totalDiscounts;
  const profitMargin = totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(1)) : 0;

  // 4. Order Status Breakdown
  const [
    totalOrdersCount,
    pendingConfirmationCount,
    confirmedCount,
    processingCount,
    shippedCount,
    deliveredCount,
    cancelledCount,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.PENDING_CONFIRMATION } }),
    prisma.order.count({ where: { status: OrderStatus.CONFIRMED } }),
    prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
    prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
    prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
    prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
  ]);

  const confirmedSalesCount = confirmedCount + processingCount + shippedCount + deliveredCount;

  // 5. Checkout Conversion Metrics
  const checkoutInitiatedCount = await prisma.checkoutEvent.count();
  const confirmationRate =
    checkoutInitiatedCount > 0 ? Number(((confirmedSalesCount / checkoutInitiatedCount) * 100).toFixed(1)) : 0;

  // 6. Product Inventory & Customer Counts
  const [totalProductsCount, totalCustomersCount] = await Promise.all([
    prisma.product.count({ where: { status: { not: "ARCHIVED" } } }),
    prisma.customer.count(),
  ]);

  return {
    financial: {
      revenue: totalRevenue,
      cogs: totalCOGS,
      grossProfit,
      operatingExpenses,
      netProfit,
      profitMargin,
    },
    orders: {
      total: totalOrdersCount,
      confirmedSales: confirmedSalesCount,
      pendingConfirmation: pendingConfirmationCount,
      confirmed: confirmedCount,
      processing: processingCount,
      shipped: shippedCount,
      delivered: deliveredCount,
      cancelled: cancelledCount,
    },
    checkout: {
      initiated: checkoutInitiatedCount,
      confirmedSales: confirmedSalesCount,
      confirmationRate,
    },
    products: {
      total: totalProductsCount,
    },
    customers: {
      total: totalCustomersCount,
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
      status: { in: CONFIRMED_SALE_STATUSES },
      createdAt: { gte: startDate, lte: endDate },
    },
    select: {
      totalAmount: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const grouped: Record<string, { date: string; revenue: number; ordersCount: number }> = {};

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
