import { z } from 'zod';
import { createFirstNameFormSchema } from '@/lib/validations/user';


export type UserFormValues = z.infer<ReturnType<typeof createFirstNameFormSchema>>;
