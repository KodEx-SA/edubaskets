import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ArrowLeft } from "lucide-react";

export default function HamperNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-12 text-center">
          <Package className="h-20 w-20 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-2">Hamper Not Found</h1>
          <p className="text-gray-600 mb-6">
            Sorry, this hamper doesn't exist or has been removed.
          </p>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link href="/student">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
