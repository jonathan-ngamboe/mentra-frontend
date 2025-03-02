'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { createFirstNameFormSchema } from '@/lib/validations/user';
import { Dictionary } from '@/types/dictionary';
import { UserFormValues } from '@/types/user';

type UserInfoFormProps = {
  dictionary: Dictionary;
};

export function UserInfoForm({ dictionary }: UserInfoFormProps) {
  //const [firstName, setFirstname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(createFirstNameFormSchema(dictionary)),
    defaultValues: {
      firstname: '',
    },
  });

  function onSubmit(data: UserFormValues) {
    console.log(data);  // eslint-disable-line no-console
  }

  const handleSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);

    try {
      onSubmit(data);
      // Optionnel : réinitialiser le formulaire après succès
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pointer-events-auto">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={dictionary.user.firstname}
                  {...field}
                  type="text"
                  disabled={isSubmitting}
                  aria-label={dictionary.user.firstname}
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />
        <Button className="w-full pointer-events-auto" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {dictionary.form.submitting || 'Submitting...'}
            </span>
          ) : (
            dictionary.form.submit
          )}
        </Button>
      </form>
    </Form>
  );
}
