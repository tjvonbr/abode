"use client";

import { cn } from "@/lib/utils";
import { Form } from "./ui/form";
import { toast } from "sonner";
import { signUpAuthSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import React from "react";
import { redirect } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { buttonVariants } from "./ui/button";
import { Icons } from "./icons";
import { supabase } from "@/lib/supabase/client";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

type FormData = z.infer<typeof signUpAuthSchema>;

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(signUpAuthSchema),
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [phoneValue, setPhoneValue] = React.useState<string>("");

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    const limitedPhoneNumber = phoneNumber.slice(0, 10);
    
    if (limitedPhoneNumber.length <= 3) {
      return limitedPhoneNumber;
    } else if (limitedPhoneNumber.length <= 6) {
      return `${limitedPhoneNumber.slice(0, 3)}-${limitedPhoneNumber.slice(3)}`;
    } else {
      return `${limitedPhoneNumber.slice(0, 3)}-${limitedPhoneNumber.slice(3, 6)}-${limitedPhoneNumber.slice(6)}`;
    }
  };

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneValue(formatted);
    
    // Set the form value to the unformatted version (digits only)
    const unformatted = formatted.replace(/\D/g, '');
    form.setValue('phone', unformatted);
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const { data: signUpData, error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`,
        },
      });

      if (error) {
        console.log(error)
        toast.error("Something bad happened!", {
          description: "We couldn't create your account. Please try again.",
        });
      }

      setIsLoading(false);

      toast.success("Account created successfully!", {
        description: "Please check your email to verify your account.",
      });

      redirect("/verify-email");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return toast.error("Something went wrong.", {
        description: error instanceof Error ? error.message : "Your sign up request failed. Please try again.",
      });
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label className="" htmlFor="firstName">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="firstName"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...form.register("firstName")}
                  />
                  {form.formState.errors?.firstName && (
                    <p className="px-1 text-xs text-red-600">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label className="" htmlFor="lastName">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="lastName"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...form.register("lastName")}
                  />
                  {form.formState.errors?.lastName && (
                    <p className="px-1 text-xs text-red-600">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...form.register("email")}
                />
                {form.formState.errors?.email && (
                  <p className="px-1 text-xs text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  placeholder="xxx-xxx-xxxx"
                  type="tel"
                  autoCapitalize="none"
                  autoComplete="tel"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={phoneValue}
                  onChange={handlePhoneChange}
                />
                {form.formState.errors?.phone && (
                  <p className="px-1 text-xs text-red-600">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>
            <button className={cn(buttonVariants(), "hover:cursor-pointer")} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign up
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
