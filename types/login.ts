import { Dictionary } from "@/types/dictionary";
import { z } from "zod";
import { createEmailFormSchema, createOtpFormSchema } from "@/lib/validations/auth";

export type OtpLoginProps = {
  dictionary: Dictionary;
  onSuccessRedirect?: string;
};

export type EmailFormValues = z.infer<ReturnType<typeof createEmailFormSchema>>;
export type OtpFormValues = z.infer<ReturnType<typeof createOtpFormSchema>>;
