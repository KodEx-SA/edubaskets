"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { items, itemCount, totalAmount, updateQuantity, removeItem } =
    useCart();

  // Calculate fees
  const subtotal = totalAmount;
  const deliveryFee = subtotal >= 250 ? 0 : 25; // Free delivery over R250
  const serviceFee = subtotal * 0.05; // 5% service fee
  const total = subtotal + deliveryFee + serviceFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-teal-600">
                Shopping Cart
              </h1>
              <Button variant="outline" asChild>
                <Link href="/student">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Empty State */}
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-20 w-20 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Add some hampers to get started!
              </p>
              <Button asChild className="bg-teal-600 hover:bg-teal-700">
                <Link href="/student">Browse Hampers</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Group items by vendor
  const itemsByVendor = items.reduce((acc, item) => {
    if (!acc[item.vendorId]) {
      acc[item.vendorId] = {
        vendorName: item.vendorName,
        items: [],
      };
    }
    acc[item.vendorId].items.push(item);
    return acc;
  }, {} as Record<string, { vendorName: string; items: typeof items }>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teal-600">
                Shopping Cart
              </h1>
              <p className="text-sm text-gray-600">{itemCount} items</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/student">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(itemsByVendor).map(
              ([vendorId, { vendorName, items: vendorItems }]) => (
                <Card key={vendorId}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">From {vendorName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {vendorItems.map((item : any) => (
                      <div
                        key={item.hamperId}
                        className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                      >
                        {/* Image */}
                        <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="h-10 w-10 text-teal-600" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            R{item.price.toFixed(2)} each
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                  updateQuantity(
                                    item.hamperId,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                  updateQuantity(
                                    item.hamperId,
                                    item.quantity + 1
                                  )
                                }
                                disabled={item.quantity >= item.stock}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <span className="text-sm text-gray-600">
                              {item.stock} in stock
                            </span>
                          </div>
                        </div>

                        {/* Price & Remove */}
                        <div className="text-right flex flex-col justify-between">
                          <p className="font-bold text-lg">
                            R{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(item.hamperId)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">R{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `R${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee (5%)</span>
                    <span className="font-medium">
                      R{serviceFee.toFixed(2)}
                    </span>
                  </div>

                  {deliveryFee > 0 && (
                    <div className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                      💡 Add R{(250 - subtotal).toFixed(2)} more for free
                      delivery!
                    </div>
                  )}

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-teal-600">
                        R{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  size="lg"
                  onClick={() => router.push("/student/checkout")}
                >
                  Proceed to Checkout
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/student">Continue Shopping</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Trust Badges */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure Payment via PayFast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Free delivery over R250</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Track your order in real-time</span>
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
