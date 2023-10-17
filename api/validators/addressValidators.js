import { z } from 'zod';

const addressSchema = z.object({
  number: z.string({
    required_error: 'number field is required',
    invalid_type_error: 'number field must be a string',
  }),
  postcode: z.string({
    required_error: 'postcode field is required',
    invalid_type_error: 'postcode field must be a string',
  }),
  address: z.string({
    required_error: 'address field is required',
    invalid_type_error: 'address field must be a string',
  }),
  city: z.string({
    required_error: 'city field is required',
    invalid_type_error: 'city field must be a string',
  }),
  country: z.nullable(
    z.string({ invalid_type_error: 'country field must be a string' }),
  ),
});

function addressValidate(params) {
  const result = addressSchema.safeParse(params);

  if (!result.success) {
    const jsonObject = JSON.parse(result.error.message);
    const { message } = jsonObject[0];

    return { result, message };
  }

  return result;
}

export default addressValidate;
