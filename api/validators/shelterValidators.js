import { z } from 'zod';

const shelterSchema = z.object({
  name: z
    .string({ required_error: 'name field is required' })
    .min(6, { message: 'name must be 6 or more characters long' }),
  email: z
    .string({ required_error: 'email field is required' })
    .email('invalid email address'),
  about: z
    .string({ required_error: 'about field is required' })
    .min(10, 'about must be 10 or more characters long'),
  phone: z
    .string({ required_error: 'phone field is required' })
    .min(8, 'phone must be 8 or more numbers long'),
  password: z
    .string({ required_error: 'password field is required' })
    .min(8, 'password must be 8 or more characters long'),
  // active: z.boolean({ required_error: 'active field is required' }),
});

function shelterValidate(params) {
  const result = shelterSchema.safeParse(params);

  if (!result.success) {
    const jsonObject = JSON.parse(result.error.message);
    const { message } = jsonObject[0];

    return { result, message };
  }

  return result;
}

export default shelterValidate;
