// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

const userSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'Name must be 5 or more characters long' }),
  email: z.string().email('Invalid email address'),
  about: z.string().min(8, 'About must be 10 or more characters long'),
  phone: z.string().min(8, 'Phone must be 8 or more numbers long'),
  password: z.string().min(8, 'Password must be 8 or more characters long'),
  rule: z.enum(['TUTOR', 'ADMIN']),
  active: z.boolean(),
});

function validateUser(params) {
  const result = userSchema.safeParse(params);

  if (!result.success) {
    const jsonObject = JSON.parse(result.error.message);
    const { message } = jsonObject[0];

    // console.log(message);

    return { result, message };
  }

  return result;
}

export default validateUser;
