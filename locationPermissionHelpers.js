import {Platform} from 'react-native';

export function checkLocationPermission() {
  return new Promise(function(resolve, reject) {
    const {
      PERMISSIONS: {ANDROID, IOS},
      check,
      RESULTS,
    } = require('react-native-permissions');
    check(
      Platform.select({
        android: ANDROID.ACCESS_FINE_LOCATION,
        ios: IOS.LOCATION_WHEN_IN_USE,
      }),
    )
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            reject(result);
            break;
          case RESULTS.DENIED:
            reject(result);
            break;
          case RESULTS.GRANTED:
            resolve(result);
            break;
          case RESULTS.BLOCKED:
            reject(result);
            break;
        }
      })
      .catch(e => {
        reject(e);
      });
  });
}
export function requestLocationPermission() {
  return new Promise(function(resolve, reject) {
    const {
      PERMISSIONS: {ANDROID, IOS},
      RESULTS,
      request,
    } = require('react-native-permissions');
    request(
      Platform.select({
        android: ANDROID.ACCESS_FINE_LOCATION,
        ios: IOS.LOCATION_WHEN_IN_USE,
      }),
    ).then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          reject(result);
          break;
        case RESULTS.DENIED:
          reject(result);
          break;
        case RESULTS.GRANTED:
          resolve(result);
          break;
        case RESULTS.BLOCKED:
          break;
      }
    });
  });
}

export function getUserLocation() {
  return new Promise(function(resolve, reject) {
    const Geolocation = require('react-native-geolocation-service').default;
    Geolocation.getCurrentPosition(
      position => {
        // const {
        //     coords: {latitude, longitude},
        // } = position;
        //
        resolve(position.coords);
      },
      error => {
        // See error code charts below.
        if (__DEV__) {
          console.log('log:: Geolocation', error);
        }
        reject(error);
      },
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 10000},
    );
  });
}
