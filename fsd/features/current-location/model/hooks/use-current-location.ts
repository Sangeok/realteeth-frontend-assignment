'use client'

import { useCallback, useEffect, useState } from 'react';
import { GEOLOCATION_OPTIONS } from '../../config';

export type LocationErrorCode =
  | 'UNSUPPORTED'
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'UNKNOWN';

export type CurrentLocation = {
  latitude: number;
  longitude: number;
};

export type LocationState =
  | { status: 'idle' }
  | { status: 'locating' }
  | { status: 'success'; location: CurrentLocation }
  | { status: 'error'; errorCode: LocationErrorCode };

type UseCurrentLocationResult = {
  locationState: LocationState;
  requestLocation: () => void;
};

function mapGeolocationError(error: GeolocationPositionError): LocationErrorCode {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'PERMISSION_DENIED';
    case error.POSITION_UNAVAILABLE:
      return 'POSITION_UNAVAILABLE';
    case error.TIMEOUT:
      return 'TIMEOUT';
    default:
      return 'UNKNOWN';
  }
}

export function useCurrentLocation(): UseCurrentLocationResult {
  const [locationState, setLocationState] = useState<LocationState>({ status: 'idle' });

  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationState({ status: 'error', errorCode: 'UNSUPPORTED' });
      return;
    }

    setLocationState({ status: 'locating' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          status: 'success',
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (error) => {
        setLocationState({
          status: 'error',
          errorCode: mapGeolocationError(error),
        });
      },
      GEOLOCATION_OPTIONS,
    );
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      requestLocation();
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [requestLocation]);

  return { locationState, requestLocation };
}
