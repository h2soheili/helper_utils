import PushNotification from 'react-native-push-notification';
import {logToConsole} from '../helpers';
import {navigateToDeepLinkPage} from '../nav';

class NotificationHandler {
  onNotification(notification) {
    // logToConsole('Notification ::: __________ ', [notification]);
    if (typeof this._onNotification === 'function') {
      this._onNotification(notification);
    }
    if (
      notification.hasOwnProperty('userInteraction') &&
      notification.userInteraction === true
    ) {
      // alert(JSON.stringify(notification))
      navigateToDeepLinkPage(notification);
    }
  }
  onRegister(token) {
    // logToConsole('NotificationHandler', [token]);
    if (typeof this._onRegister === 'function') {
      this._onRegister(token);
    }
  }
  attachRegister(handler) {
    this._onRegister = handler;
  }
  attachNotification(handler) {
    this._onNotification = handler;
  }
}
const handler = new NotificationHandler();
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: handler.onRegister.bind(handler),
  // (required) Called when a remote or local notification is opened or received
  onNotification: handler.onNotification.bind(handler),
  onAction: function(notification) {},
  //s IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,
  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: true,
});

export default handler;
