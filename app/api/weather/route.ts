import { NextResponse } from 'next/server';
import { fetchWeatherUpstream } from './lib/fetch-weather-upstream';
import { parseWeatherRequest } from './lib/parse-weather-request';

export async function GET(request: Request) {
  const parsedRequest = parseWeatherRequest(request);
  if (!parsedRequest.ok) {
    return NextResponse.json(parsedRequest.errorBody, { status: parsedRequest.status });
  }

  const upstreamResult = await fetchWeatherUpstream(parsedRequest.value);
  if (!upstreamResult.ok) {
    return NextResponse.json(upstreamResult.errorBody, { status: 502 });
  }

  return NextResponse.json(upstreamResult.data);
}
