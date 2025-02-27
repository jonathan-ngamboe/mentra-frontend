import { Dictionary } from "@/types/dictionary";
import { z } from "zod";
import { EmailFormSchema, OtpFormSchema } from "@/lib/validations/auth";

export type OtpLoginProps = {
  dictionary: Dictionary;
  onSuccessRedirect?: string;
};

export type EmailFormValues = z.infer<typeof EmailFormSchema>;
export type OtpFormValues = z.infer<typeof OtpFormSchema>;
