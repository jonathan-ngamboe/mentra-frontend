import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Input } from "@/components/ui/input";
import { Dictionary } from "@/types/dictionary";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EmailFormValues } from "@/lib/validations/auth";
import React from "react";

type LoginFormProps = {
  dictionary: Dictionary;
  email: string;
  cta: string;
  submit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setEmail: (email: string) => void;
  form: UseFormReturn<EmailFormValues>;
  isSubmitting?: boolean;
};

export const LoginForm = ({
  dictionary,
  email,
  cta,
  setEmail,
  submit,
  form,
  isSubmitting = false,
}: LoginFormProps) => {
  const isValidEmailFormat = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };
  const isEmailValid = email.trim() !== "" && isValidEmailFormat(email);

  return (
    <Form {...form}>
      <form onSubmit={submit} className="space-y-4 w-full max-w-md">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">
                {dictionary.login.email || "Email"}
              </FormLabel>
              <FormControl>
                <Input
                  id="email"
                  name="email"
                  placeholder={dictionary.login.email}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    const newEmail = e.target.value;
                    setEmail(newEmail);
                    field.onChange(e);
                  }}
                  onBlur={field.onBlur}
                  className="w-full p-3 rounded-md"
                  aria-invalid={
                    !isValidEmailFormat(email) && email.trim() !== ""
                  }
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage className="text-destructive text-center"/>
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3">
          <InteractiveHoverButton
            type="submit"
            disabled={!isEmailValid || isSubmitting}
            className="w-full place-items-center"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {dictionary.login.submitting || "Submitting..."}
              </span>
            ) : (
              cta
            )}
          </InteractiveHoverButton>

          <FormDescription className="text-center text-sm text-gray-500">
            {dictionary.login.noSpam}
          </FormDescription>
        </div>
      </form>
    </Form>
  );
};
