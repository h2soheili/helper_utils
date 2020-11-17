function getAsyncStorageDb() {
  const asyncStorage = require('@react-native-community/async-storage').default;
  if (asyncStorage) {
    return asyncStorage;
  }
  return null;
}

export function asyncStorageSetItem(key = '', payload = {}) {
  return new Promise(function(resolve, reject) {
    const db = getAsyncStorageDb();
    if (db) {
      db.setItem(
        typeof key === 'string' ? key : key.toString(),
        JSON.stringify(payload),
      )
        .then(function(res) {
          if (__DEV__) {
            console.log('log:: setItem', key, res);
          }
          resolve(true);
        })
        .catch(function(e) {
          if (__DEV__) {
            console.log('log:: setItem', key, e);
          }
          reject(e);
        });
    } else {
      reject('no db ');
    }
  });
}

export function asyncStorageGetItem(key = '') {
  return new Promise(function(resolve, reject) {
    const db = getAsyncStorageDb();
    if (db) {
      db.getItem(typeof key === 'string' ? key : key.toString())
        .then(function(res) {
          if (__DEV__) {
            console.log('log:: getItem', key, res);
          }
          if (res === null || res === 'null') {
            reject(res);
          } else {
            resolve(res);
          }
        })
        .catch(function(e) {
          if (__DEV__) {
            console.log('log:: getItem', key, e);
          }
          reject(e);
        });
    } else {
      reject('no db ');
    }
  });
}
