import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import {
  ArrowLeft,
  Package,
  Star,
  Store,
  MapPin,
  Phone,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default async function HamperDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  // Fetch hamper details
  const hamper = await prisma.hamper.findUnique({
    where: {
      id: id,
    },
    include: {
      vendor: {
        include: {
          analytics: true,
        },
      },
      items: true,
    },
  });

  if (!hamper) {
    notFound();
  }

  // Update view count
  await prisma.hamper.update({
    where: { id: id },
    data: { viewCount: { increment: 1 } },
  });

  // Calculate savings
  const savings = hamper.compareAtPrice
    ? hamper.compareAtPrice - hamper.price
    : 0;
  const savingsPercent = hamper.compareAtPrice
    ? ((savings / hamper.compareAtPrice) * 100).toFixed(0)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/student">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Quick Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-teal-100 to-green-100 flex items-center justify-center">
                <Package className="h-40 w-40 text-teal-600" />
              </div>
            </Card>

            {/* Product Info */}
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit">
                    {hamper.category.replace(/_/g, " ")}
                  </Badge>
                  <CardTitle className="text-3xl">{hamper.name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {hamper.rating.toFixed(1)}
                      </span>
                      <span>({hamper.totalRatings} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{hamper.orderCount} sold</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>{hamper.viewCount} views</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {hamper.description}
                  </p>
                </div>

                <Separator />

                {/* What's Included */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    What's Included ({hamper.items.length} items)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {hamper.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Tags */}
                {hamper.tags && hamper.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {hamper.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vendor Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  About the Vendor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {hamper.vendor.businessName}
                  </h3>
                  <p className="text-gray-600">{hamper.vendor.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {hamper.vendor.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({hamper.vendor.totalRatings})
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                    <p className="font-semibold">
                      {hamper.vendor.analytics?.totalOrders || 0}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
                    <span className="text-gray-700">
                      {hamper.vendor.businessAddress}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">
                      {hamper.vendor.businessPhone}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-teal-600">
                      R{hamper.price.toFixed(2)}
                    </span>
                    {hamper.compareAtPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        R{hamper.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      <TrendingUp className="h-4 w-4" />
                      Save R{savings.toFixed(2)} ({savingsPercent}% OFF)
                    </div>
                  )}
                </div>

                <Separator />

                {/* Stock Status */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Availability</span>
                    {hamper.stock > 0 ? (
                      <Badge className="bg-green-600">
                        {hamper.stock} in stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Out of Stock</Badge>
                    )}
                  </div>

                  {hamper.stock > 0 && hamper.stock <= 5 && (
                    <p className="text-sm text-orange-600">
                      ⚡ Only {hamper.stock} left - order soon!
                    </p>
                  )}
                </div>

                <Separator />

                {/* Add to Cart */}
                <div className="space-y-3">
                  <AddToCartButton
                    hamperId={hamper.id}
                    name={hamper.name}
                    price={hamper.price}
                    image={hamper.images[0] || ""}
                    vendorId={hamper.vendorId}
                    vendorName={hamper.vendor.businessName}
                    stock={hamper.stock}
                    className="w-full h-12 text-lg bg-teal-600 hover:bg-teal-700"
                  />
                  <Button variant="outline" className="w-full h-12" asChild>
                    <Link href="/student/cart">View Cart</Link>
                  </Button>
                </div>

                <Separator />

                {/* Delivery Info */}
                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">Delivery Information</h4>
                  <div className="space-y-1 text-gray-600">
                    <p>🚚 Standard delivery: R25</p>
                    <p>✨ FREE delivery on orders over R250</p>
                    <p>📍 Campus delivery available</p>
                    <p>⏱️ Estimated delivery: 1-2 days</p>
                  </div>
                </div>

                <Separator />

                {/* Trust Badges */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Verified Vendor</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Track Your Order</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
