"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const studentSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const vendorSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    businessName: z.string().min(2, "Business name is required"),
    businessAddress: z.string().min(5, "Business address is required"),
    businessPhone: z.string().min(10, "Business phone is required"),
    description: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type StudentFormData = z.infer<typeof studentSchema>;
type VendorFormData = z.infer<typeof vendorSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const studentForm = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const vendorForm = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
  });

  const handleStudentSubmit = async (data: StudentFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          role: "STUDENT",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVendorSubmit = async (data: VendorFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
          role: "VENDOR",
          businessName: data.businessName,
          businessAddress: data.businessAddress,
          businessPhone: data.businessPhone,
          description: data.description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-green-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-teal-600">
              Registration Successful! ✓
            </CardTitle>
            <CardDescription className="text-center">
              Redirecting to login page...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-green-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-center">
            Join eDuBaskets today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="vendor">Vendor</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form
                onSubmit={studentForm.handleSubmit(handleStudentSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="student-name">Full Name</Label>
                  <Input
                    id="student-name"
                    placeholder="John Doe"
                    {...studentForm.register("name")}
                    disabled={isLoading}
                  />
                  {studentForm.formState.errors.name && (
                    <p className="text-sm text-red-600">
                      {studentForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="student@university.edu"
                    {...studentForm.register("email")}
                    disabled={isLoading}
                  />
                  {studentForm.formState.errors.email && (
                    <p className="text-sm text-red-600">
                      {studentForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-phone">Phone Number</Label>
                  <Input
                    id="student-phone"
                    placeholder="0812345678"
                    {...studentForm.register("phoneNumber")}
                    disabled={isLoading}
                  />
                  {studentForm.formState.errors.phoneNumber && (
                    <p className="text-sm text-red-600">
                      {studentForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <Input
                    id="student-password"
                    type="password"
                    placeholder="••••••••"
                    {...studentForm.register("password")}
                    disabled={isLoading}
                  />
                  {studentForm.formState.errors.password && (
                    <p className="text-sm text-red-600">
                      {studentForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-confirm">Confirm Password</Label>
                  <Input
                    id="student-confirm"
                    type="password"
                    placeholder="••••••••"
                    {...studentForm.register("confirmPassword")}
                    disabled={isLoading}
                  />
                  {studentForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {studentForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Student Account"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="vendor">
              <form
                onSubmit={vendorForm.handleSubmit(handleVendorSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor-name">Full Name</Label>
                    <Input
                      id="vendor-name"
                      placeholder="Jane Smith"
                      {...vendorForm.register("name")}
                      disabled={isLoading}
                    />
                    {vendorForm.formState.errors.name && (
                      <p className="text-sm text-red-600">
                        {vendorForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor-email">Email</Label>
                    <Input
                      id="vendor-email"
                      type="email"
                      placeholder="vendor@business.com"
                      {...vendorForm.register("email")}
                      disabled={isLoading}
                    />
                    {vendorForm.formState.errors.email && (
                      <p className="text-sm text-red-600">
                        {vendorForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor-phone">Phone Number</Label>
                  <Input
                    id="vendor-phone"
                    placeholder="0812345678"
                    {...vendorForm.register("phoneNumber")}
                    disabled={isLoading}
                  />
                  {vendorForm.formState.errors.phoneNumber && (
                    <p className="text-sm text-red-600">
                      {vendorForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor-business-name">Business Name</Label>
                  <Input
                    id="vendor-business-name"
                    placeholder="Campus Store"
                    {...vendorForm.register("businessName")}
                    disabled={isLoading}
                  />
                  {vendorForm.formState.errors.businessName && (
                    <p className="text-sm text-red-600">
                      {vendorForm.formState.errors.businessName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor-business-address">
                    Business Address
                  </Label>
                  <Input
                    id="vendor-business-address"
                    placeholder="123 Campus Road"
                    {...vendorForm.register("businessAddress")}
                    disabled={isLoading}
                  />
                  {vendorForm.formState.errors.businessAddress && (
                    <p className="text-sm text-red-600">
                      {vendorForm.formState.errors.businessAddress.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor-business-phone">Business Phone</Label>
                  <Input
                    id="vendor-business-phone"
                    placeholder="0123456789"
                    {...vendorForm.register("businessPhone")}
                    disabled={isLoading}
                  />
                  {vendorForm.formState.errors.businessPhone && (
                    <p className="text-sm text-red-600">
                      {vendorForm.formState.errors.businessPhone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor-description">
                    Business Description (Optional)
                  </Label>
                  <Textarea
                    id="vendor-description"
                    placeholder="Describe your business..."
                    {...vendorForm.register("description")}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor-password">Password</Label>
                    <Input
                      id="vendor-password"
                      type="password"
                      placeholder="••••••••"
                      {...vendorForm.register("password")}
                      disabled={isLoading}
                    />
                    {vendorForm.formState.errors.password && (
                      <p className="text-sm text-red-600">
                        {vendorForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor-confirm">Confirm Password</Label>
                    <Input
                      id="vendor-confirm"
                      type="password"
                      placeholder="••••••••"
                      {...vendorForm.register("confirmPassword")}
                      disabled={isLoading}
                    />
                    {vendorForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {vendorForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Vendor Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-teal-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
