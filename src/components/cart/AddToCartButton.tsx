"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  hamperId: string;
  name: string;
  price: number;
  image: string;
  vendorId: string;
  vendorName: string;
  stock: number;
  className?: string;
}

export function AddToCartButton({
  hamperId,
  name,
  price,
  image,
  vendorId,
  vendorName,
  stock,
  className,
}: AddToCartButtonProps) {
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = isInCart(hamperId);

  const handleAddToCart = () => {
    addItem({
      hamperId,
      name,
      price,
      image,
      vendorId,
      vendorName,
      stock,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  if (stock === 0) {
    return (
      <Button className={className} disabled>
        Out of Stock
      </Button>
    );
  }

  if (justAdded) {
    return (
      <Button className={className} disabled>
        <Check className="h-4 w-4 mr-2" />
        Added to Cart!
      </Button>
    );
  }

  return (
    <Button
      className={className}
      onClick={handleAddToCart}
      variant={inCart ? "outline" : "default"}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {inCart ? "Add More" : "Add to Cart"}
    </Button>
  );
}
