import { z } from "zod";

export const signInAuthSchema = z.object({
  email: z.string().email(),
});

export const signUpAuthSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must be exactly 10 digits")
    .regex(/^\d{10}$/, "Phone number must contain only digits"),
});