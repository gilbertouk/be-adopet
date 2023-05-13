// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

const adoptionSchema = z.object({
  date: z.date({
    required_error: 'date field is required',
    invalid_type_error: 'date field must be the adoption date',
  }),
  user_id: z
    .number({
      required_error: 'user_id is required',
      invalid_type_error: 'user_id must be a number',
    })
    .int(),
  pet_id: z
    .number({
      required_error: 'pet_id field is required',
      invalid_type_error: 'pet_id field must be a number',
    })
    .int(),
});

function adoptionValidate(params) {
  const result = adoptionSchema.safeParse(params);

  if (!result.success) {
    const jsonObject = JSON.parse(result.error.message);
    const { message } = jsonObject[0];

    return { result, message };
  }

  return result;
}

export default adoptionValidate;
