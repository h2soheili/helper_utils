import RNFetchBlob from 'rn-fetch-blob';
import {IMAGE_DOMAIN, PUBLIC_API} from '../../Constants/api';
import {logToConsole} from '../helpers';
const Platform = require('react-native').Platform;
const dir = RNFetchBlob.fs.dirs.CacheDir;
export const CACHE_FILE_BASE_DIR = dir + '/daapapp/';
// export const BASE_DIR = RNFetchBlob.fs.dirs.CacheDir + '/daapapp.crmrn/crmrn';
export const FILE_PREFIX = Platform.OS === 'ios' ? '' : 'file://';

export function getClusterImageList(tryCount = 0, maxTryCount = 4) {
  return new Promise(function(resolve, reject) {
    if (tryCount < maxTryCount) {
      fetch(PUBLIC_API + 'clusters')
        .then(function(res) {
          return res.json();
        })
        .then(function(res) {
          resolve(res.data);
        })
        .catch(function(e) {
          reject(e);
        });
    } else {
      reject('log:: getImageList failed');
    }
  });
}

let i = 0;
let j = 0;

/**
 *  get marker icons
 * @param list
 * @param url
 */
export function loopForDownloadList(list = [], baseUrl = '') {
  list.forEach((url, i) => {
    setTimeout(() => {
      Downloader.get(baseUrl + url).finally(e => {});
    }, 20 * i);
  });
}
// export function loopForDownloadClusterList(list = [], url = '') {
//   setTimeout(function() {
//     if (list.length > 0) {
//       Downloader.get(url + list[j]).finally(e => {});
//       j++;
//       /**
//        * loop to download all list images
//        */
//       loopForDownloadClusterList(list.pop(), url);
//     } else {
//       // terminate thread
//       // self.postMessage('stop_service');
//     }
//   }, 100);
// }

const s4 = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
/**
 *
 *
 *
 */
class Downloader {
  static checkUrlIsValid(url) {
    if (url && typeof url === 'string' && url !== 'undefined') {
      return true;
    }
    return false;
  }
  static getPath(url = '', immutable = true) {
    const ext =
      url.indexOf('.') === -1 ? '.png' : url.substring(url.indexOf('.'));
    if (immutable === true) {
      return FILE_PREFIX + CACHE_FILE_BASE_DIR + url + ext;
    } else {
      return null;
    }
  }
  static checkIfExist(url) {
    return new Promise(function(resolve, reject) {
      let tempUrl = url.split('/');
      const path = CACHE_FILE_BASE_DIR + tempUrl[tempUrl.length - 1];
      RNFetchBlob.fs
        .exists(path)
        .then(exists => {
          if (exists) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(function(e) {
          reject(false);
        });
    });
  }
  static get(url) {
    return new Promise(function(resolve, reject) {
      // We check here if IOS didn't delete the cache content
      if (Downloader.checkUrlIsValid(url)) {
        Downloader.checkIfExist(url)
          .then(exists => {
            if (exists) {
              resolve(true);
            } else {
              Downloader.download(url)
                .then(res => {
                  resolve(res);
                })
                .catch(e => {
                  reject(e);
                });
            }
          })
          .catch(function(e) {
            reject(e);
          });
      } else {
        reject('url is not valid');
      }
    });
  }
  static clearCache() {
    return RNFetchBlob.fs.unlink(CACHE_FILE_BASE_DIR);
  }
  static download(url = null, method = 'GET', headers = {}) {
    return new Promise(function(resolve, reject) {
      let tempUrl = url.split('/');
      const path = CACHE_FILE_BASE_DIR + tempUrl[tempUrl.length - 1];
      RNFetchBlob.config({
        fileCache: true,
        // appendExt: 'png',
        // path: path,
        addAndroidDownloads: {
          useDownloadManager: true, // <-- this is the only thing required
          // Optional, override notification setting (default to true)
          notification: false,
          // Optional, but recommended since android DownloadManager will fail when
          // the url does not contains a file extension, by default the mime type will be text/plain
          mime: 'image/png',
          description: 'File downloaded by download manager.',
        },
      })
        .fetch(method, url, headers)
        .then(res => {
          console.log('log:::::: download res.path:: ', res.path());
          // you must prepend "file://"" before the file path
          // imageView = <Image source={{ uri : Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path() }}/>
          resolve(true);
        })
        .catch(e => {
          reject(null);
        });
    });
  }
}
export {Downloader};
export function getImageList(tryCount = 0, maxTryCount = 4) {
  return new Promise(function(resolve, reject) {
    if (tryCount < maxTryCount) {
      fetch(PUBLIC_API + 'category_subcategory')
        .then(function(res) {
          return res.json();
        })
        .then(function(res) {
          const {categories, sub_categories} = res.data;
          const data = categories.concat(sub_categories);
          resolve(data);
        })
        .catch(function(e) {
          reject(e);
        });
    } else {
      reject('log:: getImageList failed');
    }
  });
}
