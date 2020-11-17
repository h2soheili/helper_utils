import {codePushKeys} from '../Constants/codePushKeys';
import {logToConsole} from './helpers';

function loadCodePushModule() {
  const codePush = require('react-native-code-push');
  return codePush;
}

export function codePushSync() {
  return new Promise(function(resolve, reject) {
    const codePush = loadCodePushModule();
    checkCodePushUpdate().then(status => {
      codePush
        .sync({
          checkFrequency: codePush.CheckFrequency.ON_APP_START,
          installMode: codePush.InstallMode.IMMEDIATE,
          deploymentKey: codePushKeys,
        })
        .then(result => {
          resolve(result);
        })
        .catch(e => {
          reject(e);
        });
    });
  });
}

function checkCodePushUpdate() {
  return new Promise(function(resolve, reject) {
    const codePush = loadCodePushModule();
    return codePush
      .checkCodePushUpdate()
      .then(syncStatus => {
        // wait for the initial code sync to complete else we get flicker
        // in the app when it updates after it has started up and is
        // on the Home screen
        resolve(syncStatus);
      })
      .catch(e => {
        // this could happen if the app doesn't have connectivity
        // just go ahead and start up as normal
        reject(e);
      });
  });
}
