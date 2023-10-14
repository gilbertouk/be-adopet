// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

const petSchema = z.object({
  url_photo: z
    .string({ required_error: 'url_photo field is required' })
    .url('invalid url'),
  age: z.date({
    invalid_type_error:
      "age field is required and must be the pet's date of birth",
    required_error: 'age field is required',
  }),
  description: z
    .string({
      invalid_type_error: 'description must be a string',
      required_error: 'description field is required',
    })
    .min(12, 'description must be 12 or more characters long'),
  available: z.boolean({
    required_error: 'available field is required',
    invalid_type_error: 'available must be a boolean',
  }),
  name: z
    .string({
      invalid_type_error: 'name must be a string',
      required_error: 'name field is required',
    })
    .min(2, 'name must be 2 or more characters long'),
  shelter_id: z.number({
    required_error: 'shelter_id field is required',
    invalid_type_error: 'shelter_id must be a number',
  }),
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
