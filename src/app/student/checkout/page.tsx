"use client";

import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, MapPin, User } from "lucide-react";
import Link from "next/link";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  deliveryAddress: z.string().min(5, "Please enter a valid delivery address"),
  deliveryNotes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, totalAmount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "",
      deliveryAddress: "",
      deliveryNotes: "",
    },
  });

  // Calculate fees
  const subtotal = totalAmount;
  const deliveryFee = subtotal >= 250 ? 0 : 25;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + deliveryFee + serviceFee;

  // Redirect if cart is empty
  if (items.length === 0) {
    router.push("/student/cart");
    return null;
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create order
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            hamperId: item.hamperId,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          deliveryFee,
          serviceFee,
          total,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create order");
      }

      // Clear cart
      clearCart();

      // Redirect to payment
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        router.push(`/student/orders/${result.orderId}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Button variant="ghost" asChild>
            <Link href="/student/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600 mb-8">Complete your order</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        {...register("name")}
                        disabled={isSubmitting}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...register("email")}
                          disabled={isSubmitting}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="0812345678"
                          {...register("phone")}
                          disabled={isSubmitting}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Information */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="deliveryAddress">Address</Label>
                      <Input
                        id="deliveryAddress"
                        placeholder="e.g., Campus Dorm B, Room 301"
                        {...register("deliveryAddress")}
                        disabled={isSubmitting}
                      />
                      {errors.deliveryAddress && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.deliveryAddress.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="deliveryNotes">
                        Delivery Notes (Optional)
                      </Label>
                      <Textarea
                        id="deliveryNotes"
                        placeholder="Any special instructions for delivery..."
                        rows={3}
                        {...register("deliveryNotes")}
                        disabled={isSubmitting}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button - Mobile */}
                <div className="lg:hidden mt-6">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-teal-600 hover:bg-teal-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Proceed to Payment (R{total.toFixed(2)})</>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items by Vendor */}
                  <div className="space-y-4">
                    {Object.entries(itemsByVendor).map(
                      ([vendorId, { vendorName, items: vendorItems }]) => (
                        <div key={vendorId}>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            From {vendorName}
                          </p>
                          <div className="space-y-2">
                            {vendorItems.map((item) => (
                              <div
                                key={item.hamperId}
                                className="flex justify-between text-sm"
                              >
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-gray-600">
                                    {item.quantity} × R{item.price.toFixed(2)}
                                  </p>
                                </div>
                                <p className="font-medium">
                                  R{(item.quantity * item.price).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                          <Separator className="mt-3" />
                        </div>
                      )
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        R{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">
                        {deliveryFee === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `R${deliveryFee.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-medium">
                        R{serviceFee.toFixed(2)}
                      </span>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex justify-between items-center pt-2">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold text-teal-600">
                        R{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button - Desktop */}
                  <div className="hidden lg:block pt-4">
                    <Button
                      onClick={handleSubmit(onSubmit)}
                      className="w-full h-12 bg-teal-600 hover:bg-teal-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Proceed to Payment</>
                      )}
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure Payment via PayFast</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Your data is encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Track your order in real-time</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
