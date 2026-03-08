export type GridCoordinate = {
  nx: string;
  ny: string;
};

// 위도, 경도 -> 격자 좌표 변환(기상청 API는 격자 좌표를 사용하기 때문)
export function convertLatLngToGrid(
  latitude: number,
  longitude: number,
): GridCoordinate {
  const EARTH_RADIUS_KM = 6371.00877;
  const GRID_SIZE_KM = 5.0;
  const STANDARD_LATITUDE_1 = 30.0;
  const STANDARD_LATITUDE_2 = 60.0;
  const ORIGIN_LONGITUDE = 126.0;
  const ORIGIN_LATITUDE = 38.0;
  const ORIGIN_X = 43;
  const ORIGIN_Y = 136;
  const DEGREE_TO_RADIAN = Math.PI / 180.0;

  const scaledEarthRadius = EARTH_RADIUS_KM / GRID_SIZE_KM;
  const standardLatitude1 = STANDARD_LATITUDE_1 * DEGREE_TO_RADIAN;
  const standardLatitude2 = STANDARD_LATITUDE_2 * DEGREE_TO_RADIAN;
  const originLongitude = ORIGIN_LONGITUDE * DEGREE_TO_RADIAN;
  const originLatitude = ORIGIN_LATITUDE * DEGREE_TO_RADIAN;

  let projectionScale =
    Math.tan(Math.PI * 0.25 + standardLatitude2 * 0.5) /
    Math.tan(Math.PI * 0.25 + standardLatitude1 * 0.5);
  projectionScale =
    Math.log(Math.cos(standardLatitude1) / Math.cos(standardLatitude2)) /
    Math.log(projectionScale);

  let projectionFactor = Math.tan(Math.PI * 0.25 + standardLatitude1 * 0.5);
  projectionFactor =
    (Math.pow(projectionFactor, projectionScale) * Math.cos(standardLatitude1)) /
    projectionScale;

  let originRadius = Math.tan(Math.PI * 0.25 + originLatitude * 0.5);
  originRadius =
    (scaledEarthRadius * projectionFactor) /
    Math.pow(originRadius, projectionScale);

  let pointRadius = Math.tan(Math.PI * 0.25 + latitude * DEGREE_TO_RADIAN * 0.5);
  pointRadius =
    (scaledEarthRadius * projectionFactor) /
    Math.pow(pointRadius, projectionScale);

  let theta = longitude * DEGREE_TO_RADIAN - originLongitude;
  if (theta > Math.PI) {
    theta -= 2.0 * Math.PI;
  }
  if (theta < -Math.PI) {
    theta += 2.0 * Math.PI;
  }
  theta *= projectionScale;

  const x = Math.floor(pointRadius * Math.sin(theta) + ORIGIN_X + 0.5);
  const y = Math.floor(originRadius - pointRadius * Math.cos(theta) + ORIGIN_Y + 0.5);

  return { nx: String(x), ny: String(y) };
}
