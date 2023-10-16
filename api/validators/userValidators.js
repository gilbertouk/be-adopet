// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

const userSchema = z.object({
  name: z
    .string({ required_error: 'name field is required' })
    .min(6, 'name must be 6 or more characters long'),
  email: z
    .string({ required_error: 'email field is required' })
    .email('invalid email address'),
  about: z
    .string({ required_error: 'about field is required' })
    .min(8, 'about must be 10 or more characters long'),
  phone: z
    .string({ required_error: 'phone field is required' })
    .min(8, 'phone must be 8 or more numbers long'),
  password: z
    .string({ required_error: 'password field is required' })
    .min(8, 'password must be 8 or more characters long'),
  role: z.enum(['TUTOR', 'ADMIN']),
  // active: z.boolean(),
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
