import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  AlertCircle,
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Get platform stats
  const [
    totalUsers,
    totalVendors,
    pendingVendors,
    totalHampers,
    totalOrders,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.vendor.count(),
    prisma.vendor.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.hamper.count(),
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        vendor: { select: { businessName: true } },
      },
    }),
  ]);

  // Calculate total revenue
  const orders = await prisma.order.findMany({
    where: { status: "DELIVERED" },
    select: { total: true },
  });
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teal-600">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">Platform Management</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-purple-600">Admin</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Pending Approvals Alert */}
        {pendingVendors > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-900">
                      {pendingVendors} Vendor{pendingVendors > 1 ? "s" : ""}{" "}
                      Pending Approval
                    </h3>
                    <p className="text-sm text-orange-800">
                      Review and approve vendor applications
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  variant="default"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Link href="/admin/vendors">Review Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Store className="h-4 w-4" />
                Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalVendors}</div>
              {pendingVendors > 0 && (
                <p className="text-sm text-orange-600 mt-1">
                  {pendingVendors} pending
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Hampers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalHampers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                R{totalRevenue.toFixed(0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-6 flex-col gap-2"
              asChild
            >
              <Link href="/admin/vendors">
                <Store className="h-8 w-8" />
                <span className="font-semibold">Manage Vendors</span>
                {pendingVendors > 0 && (
                  <Badge variant="destructive" className="mt-1">
                    {pendingVendors} pending
                  </Badge>
                )}
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex-col gap-2"
              asChild
            >
              <Link href="/admin/users">
                <Users className="h-8 w-8" />
                <span className="font-semibold">User Management</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex-col gap-2"
              asChild
            >
              <Link href="/admin/orders">
                <ShoppingBag className="h-8 w-8" />
                <span className="font-semibold">Monitor Orders</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex-col gap-2"
              asChild
            >
              <Link href="/admin/settings">
                <Package className="h-8 w-8" />
                <span className="font-semibold">Settings</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Button variant="outline" asChild>
              <Link href="/admin/orders">View All</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {order.user.name} → {order.vendor.businessName}
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
        </div>
      </main>
    </div>
  );
}
