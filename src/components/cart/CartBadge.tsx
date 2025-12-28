"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export function CartBadge() {
  const { itemCount } = useCart();

  return (
    <Button asChild className="bg-teal-600 hover:bg-teal-700 relative">
      <Link href="/student/cart">
        <ShoppingCart className="h-4 w-4 mr-2" />
        Cart
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
