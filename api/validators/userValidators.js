// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(6, 'Name must be 6 or more characters long'),
  email: z.string().email('Invalid email address'),
  about: z.string().min(8, 'About must be 10 or more characters long'),
  phone: z.string().min(8, 'Phone must be 8 or more numbers long'),
  password: z.string().min(8, 'Password must be 8 or more characters long'),
  role: z.enum(['TUTOR', 'ADMIN']),
  active: z.boolean(),
});

function userValidate(params) {
  const result = userSchema.safeParse(params);

  if (!result.success) {
    const jsonObject = JSON.parse(result.error.message);
    const { message } = jsonObject[0];

    // console.log(message);

    return { result, message };
  }

  return result;
}

export default userValidate;
