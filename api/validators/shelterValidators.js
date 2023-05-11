import { z } from 'zod';

const shelterSchema = z.object({
  name: z
    .string()
    .min(6, { message: 'Name must be 6 or more characters long' }),
  email: z.string().email('Invalid email address'),
  about: z.string().min(8, 'About must be 10 or more characters long'),
  phone: z.string().min(8, 'Phone must be 8 or more numbers long'),
  password: z.string().min(8, 'Password must be 8 or more characters long'),
  active: z.boolean(),
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
