import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Star } from "lucide-react";

export default async function StudentDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch available hampers
  const hampers = await prisma.hamper.findMany({
    where: {
      isAvailable: true,
      stock: {
        gt: 0,
      },
    },
    include: {
      vendor: {
        select: {
          businessName: true,
          rating: true,
        },
      },
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
  });

  // Get user's recent orders
  const recentOrders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teal-600">eDuBaskets</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {session.user.name}!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/student/orders">
                  <Package className="h-4 w-4 mr-2" />
                  My Orders
                </Link>
              </Button>
              <Button asChild className="bg-teal-600 hover:bg-teal-700">
                <Link href="/student/cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{recentOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Available Hampers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{hampers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Set(hampers.map((h) => h.vendorId)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            <div className="grid gap-4">
              {recentOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
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
        )}

        {/* Browse Hampers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Browse Hampers</h2>
            <Button variant="outline" asChild>
              <Link href="/student/hampers">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hampers.map((hamper) => (
              <Card
                key={hamper.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gradient-to-br from-teal-100 to-green-100 flex items-center justify-center">
                  <Package className="h-20 w-20 text-teal-600" />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{hamper.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {hamper.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-teal-600">
                        R{hamper.price.toFixed(2)}
                      </span>
                      {hamper.compareAtPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          R{hamper.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {hamper.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({hamper.totalRatings})
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      by {hamper.vendor.businessName}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {hamper.category.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Stock: {hamper.stock}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    asChild
                  >
                    <Link href={`/student/hampers/${hamper.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {hampers.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">
                  No Hampers Available
                </h3>
                <p className="text-gray-600">
                  Check back soon for new hampers!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
