export type WeatherRequestParams = {
  nx: string;
  ny: string;
};

type ParseWeatherRequestSuccess = {
  ok: true;
  value: WeatherRequestParams;
};

type ParseWeatherRequestFailure = {
  ok: false;
  status: 400;
  errorBody: {
    error: string;
  };
};

export type ParseWeatherRequestResult =
  | ParseWeatherRequestSuccess
  | ParseWeatherRequestFailure;

function failure(error: string): ParseWeatherRequestFailure {
  return { ok: false, status: 400, errorBody: { error } };
}

export function parseWeatherRequest(
  request: Request,
): ParseWeatherRequestResult {
  const { searchParams } = new URL(request.url);
  const nxParam = searchParams.get('nx');
  const nyParam = searchParams.get('ny');

  if (!nxParam || !nyParam) {
    return failure('nx and ny are required.');
  }

  if (!/^\d+$/.test(nxParam) || !/^\d+$/.test(nyParam)) {
    return failure('nx and ny must be positive integers.');
  } 

  return {
    ok: true,
    value: {
      nx: nxParam,
      ny: nyParam,
    },
  };
}
