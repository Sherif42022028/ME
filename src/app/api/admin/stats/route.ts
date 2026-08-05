import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getDashboardOverviewStats, getRevenueTimelineData, getTrafficSourcesData } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  try {
    // Protected Admin Route
    await requireAdmin();

    const searchParams = req.nextUrl.searchParams;
    const rangePreset = searchParams.get("range") || "30d";

    const [overview, timeline, trafficSources] = await Promise.all([
      getDashboardOverviewStats(),
      getRevenueTimelineData(rangePreset),
      getTrafficSourcesData(),
    ]);

    return NextResponse.json({
      success: true,
      overview,
      timeline,
      trafficSources,
    });
  } catch (error: any) {
    if (error.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    console.error("Dashboard Stats API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
