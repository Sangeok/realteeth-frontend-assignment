import { z } from 'zod';

const coordinateSchema = z
  .string()
  .trim()
  .min(1)
  .transform(Number)
  .pipe(z.number().finite());

const GeocoderQuerySchema = z.object({
  latitude: coordinateSchema.pipe(z.number().min(-90).max(90)),
  longitude: coordinateSchema.pipe(z.number().min(-180).max(180)),
});

export type GeocoderRequestParams = z.infer<typeof GeocoderQuerySchema>;

type ValidateGeocoderRequestSuccess = {
  success: true;
  data: GeocoderRequestParams;
};

type ValidateGeocoderRequestFailure = {
  success: false;
  status: 400;
  errorBody: {
    error: string;
  };
};

export type ValidateGeocoderRequestResult =
  | ValidateGeocoderRequestSuccess
  | ValidateGeocoderRequestFailure;

function failure(error: string): ValidateGeocoderRequestFailure {
  return { success: false, status: 400, errorBody: { error } };
}

export function validateGeocoderRequest(
  request: Request,
): ValidateGeocoderRequestResult {
  const { searchParams } = new URL(request.url);

  const result = GeocoderQuerySchema.safeParse({
    latitude: searchParams.get('latitude'),
    longitude: searchParams.get('longitude'),
  });

  if (!result.success) {
    return failure(
      'Invalid latitude/longitude. Use decimal degrees with latitude [-90,90], longitude [-180,180].',
    );
  }

  return {
    success: true,
    data: result.data,
  };
}
