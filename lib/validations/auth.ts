import { Dictionary } from "@/types/dictionary";
import { z } from "zod";

// Schema to validate email
export const createEmailFormSchema = (dictionary: Dictionary) => z.object({
  email: z
    .string()
    .min(1, { message: dictionary.login.emailRequired })
    .email({ message: dictionary.login.invalidEmail }),
});

// Schema to validate OTP code
export const createOtpFormSchema = (dictionary: Dictionary) => z.object({
  pin: z
    .string()
    .min(6, { message: dictionary.login.otp.otpLength })
    .max(6, { message: dictionary.login.otp.otpLength })
    .regex(/^\d+$/, { message: dictionary.login.otp.otpOnlyDigits }),
});

// Exported types for form values
export type EmailFormValues = z.infer<ReturnType<typeof createEmailFormSchema>>;
export type OtpFormValues = z.infer<ReturnType<typeof createOtpFormSchema>>;
