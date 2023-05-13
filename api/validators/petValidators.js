// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

const petSchema = z.object({
  url_photo: z.string().url('Invalid url'),
  age: z.date({
    invalid_type_error: "age field must be the pet's date of birth",
    required_error: 'age field is required',
  }),
  description: z
    .string()
    .min(12, 'Description must be 12 or more characters long'),
  available: z.boolean({
    required_error: 'available is required',
    invalid_type_error: 'available must be a boolean',
  }),
  name: z.string().min(2, 'Name must be 2 or more characters long'),
  shelter_id: z
    .number({
      required_error: 'shelter_id is required',
      invalid_type_error: 'shelter_id must be a number',
    })
    .int(),
});

function petValidate(params) {
  const result = petSchema.safeParse(params);

  if (!result.success) {
    const jsonObject = JSON.parse(result.error.message);
    const { message } = jsonObject[0];

    return { result, message };
  }

  return result;
}

export default petValidate;
