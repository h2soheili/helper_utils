import AsyncStorage from '@react-native-community/async-storage';
import BackgroundFetch, {
  BackgroundFetchStatus,
} from 'react-native-background-fetch';

const EVENTS_KEY = '@events';

export const persistEvents = async <T>(data: T) => {
  try {
    return AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(data));
  } catch (e) {
    console.log('AsyncStorage:setItem', e);
  }
};

export const loadEvents = async <T>(): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(EVENTS_KEY);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.log('AsyncStorage:getItem', e);
  }
  return Promise.resolve(null);
};

/// Render Date to string
export const getTimestamp = (date: Date = new Date()) => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

/// Render BackgroundFetchStatus to text.
export const statusToString = (status: BackgroundFetchStatus): string => {
  switch (status) {
    case BackgroundFetch.STATUS_RESTRICTED:
      console.log('[BackgroundFetch] status: restricted');
      return 'restricted';
    case BackgroundFetch.STATUS_DENIED:
      console.log('[BackgroundFetch] status: denied');
      return 'denied';
    case BackgroundFetch.STATUS_AVAILABLE:
      console.log('[BackgroundFetch] status: enabled');
      return 'available';
  }
  return 'unknown';
};
