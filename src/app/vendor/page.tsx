import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingBag, DollarSign, Landmark, Clock, Plus } from "lucide-react";

export default async function VendorDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get vendor profile
  const vendor = await prisma.vendor.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      analytics: true,
    },
  });

  if (!vendor) {
    redirect("/login");
  }

  // Get hampers
  const hampers = await prisma.hamper.findMany({
    where: {
      vendorId: vendor.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get recent orders
  const recentOrders = await prisma.order.findMany({
    where: {
      vendorId: vendor.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      items: true,
    },
  });

  // Calculate stats
  const activeHampers = hampers.filter((h) => h.isAvailable).length;
  const totalStock = hampers.reduce((sum, h) => sum + h.stock, 0);
  const pendingOrders = recentOrders.filter(
    (o) => o.status === "PAID" || o.status === "CONFIRMED"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teal-600">
                Vendor Dashboard
              </h1>
              <p className="text-sm text-gray-600">{vendor.businessName}</p>
            </div>
            <div className="flex items-center gap-4">
              {vendor.status === "PENDING_APPROVAL" && (
                <Badge variant="secondary" className="text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending Approval
                </Badge>
              )}
              {vendor.status === "APPROVED" && (
                <Badge className="text-sm bg-green-600">✓ Approved</Badge>
              )}
              <Button asChild className="bg-teal-600 hover:bg-teal-700">
                <Link href="/vendor/hampers/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hamper
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Approval Status Warning */}
        {vendor.status === "PENDING_APPROVAL" && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-900">
                    Account Pending Approval
                  </h3>
                  <p className="text-sm text-yellow-800">
                    Your vendor account is under review. You can create hampers,
                    but they won't be visible to students until your account is
                    approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Landmark className="h-4 w-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                R{vendor.analytics?.totalRevenue.toFixed(2) || "0.00"}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {vendor.analytics?.totalOrders || 0} orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Active Hampers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeHampers}</div>
              <p className="text-sm text-gray-600 mt-1">
                {hampers.length} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Total Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStock}</div>
              <p className="text-sm text-gray-600 mt-1">items available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingOrders}</div>
              <p className="text-sm text-gray-600 mt-1">need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-6 flex-col gap-2"
              asChild
            >
              <Link href="/vendor/hampers">
                <Package className="h-8 w-8" />
                <span className="font-semibold">Manage Hampers</span>
                <span className="text-sm text-gray-600">
                  {hampers.length} hampers
                </span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-6 flex-col gap-2"
              asChild
            >
              <Link href="/vendor/orders">
                <ShoppingBag className="h-8 w-8" />
                <span className="font-semibold">View Orders</span>
                <span className="text-sm text-gray-600">
                  {recentOrders.length} recent
                </span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-6 flex-col gap-2"
              asChild
            >
              <Link href="/vendor/analytics">
                <Landmark className="h-8 w-8" />
                <span className="font-semibold">Analytics</span>
                <span className="text-sm text-gray-600">View insights</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Button variant="outline" asChild>
              <Link href="/vendor/orders">View All</Link>
            </Button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {order.studentName} • {order.items.length} items
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          R{order.total.toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            order.status === "DELIVERED"
                              ? "default"
                              : order.status === "CANCELLED"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {order.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                <p className="text-gray-600">Your orders will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
