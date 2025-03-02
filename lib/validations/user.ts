import { Dictionary } from '@/types/dictionary';
import { z } from 'zod';

export const createFirstNameFormSchema = (dictionary: Dictionary) =>
  z.object({
    firstname: z
      .string()
      .min(1, { message: `${dictionary.user.firstname} ${dictionary.form.validation.required}` })
      .max(50, { message: dictionary.form.validation.userNameLength })
      .regex(/^[a-zA-Z\s]*$/, {
        message: `${dictionary.user.firstname} ${dictionary.form.validation.onlyLetters}`,
      }),
  });
