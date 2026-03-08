import { NextResponse } from 'next/server';
import { fetchGeocoderUpstream } from './lib/fetch-geocoder-upstream';
import { validateGeocoderRequest } from './lib/validate-geocoder-request';

export async function GET(request: Request) {
  const validationResult = validateGeocoderRequest(request);
  if (!validationResult.success) {
    return NextResponse.json(validationResult.errorBody, { status: validationResult.status });
  }

  const upstreamResult = await fetchGeocoderUpstream(validationResult.data);
  if (!upstreamResult.success) {
    return NextResponse.json(upstreamResult.errorBody, { status: 502 });
  }

  return NextResponse.json(upstreamResult.data);
}
