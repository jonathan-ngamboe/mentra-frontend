import { z } from "zod";

// Schema to validate email
export const EmailFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});

// Schema to validate OTP code
export const OtpFormSchema = z.object({
  pin: z
    .string()
    .min(6, { message: "OTP must be 6 digits" })
    .max(6, { message: "OTP must be 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only digits" }),
});

// Exported types for form values
export type EmailFormValues = z.infer<typeof EmailFormSchema>;
export type OtpFormValues = z.infer<typeof OtpFormSchema>;
