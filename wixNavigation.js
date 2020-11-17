import {Navigation} from 'react-native-navigation';
import Screens, {CRMRN} from '../Constants/screens';
import Font from '../Constants/font';
import {height, scaleFontSize, width} from './window';
import {RNNDrawer} from 'react-native-navigation-drawer-extension';
import {Linking, Platform} from 'react-native';
import {colors} from '../Constants/colors';
export const statusBar = {
  backgroundColor: colors.green,
};
export const tabBarSetting = {
  title: {
    visible: false,
  },
  statusBar: statusBar,
};
export const hideBottomBar = {
  bottomTabs: {visible: false},
};
export const navAnimation = {
  push: {
    waitForRender: true,
  },
  pop: {
    waitForRender: true,
  },
  showModal: {
    waitForRender: true,
  },
};

export function pushScreen(
  componentId = '',
  screen = '',
  options = {},
  passProps = {},
  timeOut = 32,
) {
  setTimeout(function() {
    Navigation.push(componentId, {
      component: {
        id: screen,
        name: screen, // Push the screen registered with the 'Settings' key
        options: {
          // Optional options object to configure the screen
          topBar: tabBarSetting,
          ...options,
          sideMenu: {
            right: {
              height: height,
            },
          },
          statusBar: statusBar,
          animations: navAnimation,
        },
        passProps: passProps,
      },
    });
  }, timeOut);
}
export function popScreen(screen) {
  setTimeout(() => {
    Navigation.pop(screen, {animations: navAnimation});
  }, 32);
}

export function resetToMainScreen(stack = []) {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: Screens.DrawerScreen,
        children: [
          {
            stack: {
              id: Screens.DrawerStack,
              children: [
                {
                  component: {
                    id: Screens.Main,
                    name: Screens.Main,
                    options: tabBarSetting,
                  },
                },
              ].concat(stack),
              options: {
                bottomTab: {
                  icon: require('../Assetes/bottombar/map.png'),
                  selectedIcon: require('../Assetes/bottombar/map_b.png'),
                  text: 'نقشه',
                },
                statusBar: statusBar,
              },
            },
            options: {
              statusBar: statusBar,
            },
          },
          {
            stack: {
              id: Screens.CardStack,
              children: [
                {
                  component: {
                    id: Screens.Cards,
                    name: Screens.Cards,
                    options: {
                      statusBar: statusBar,
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  icon: require('../Assetes/bottombar/card.png'),
                  selectedIcon: require('../Assetes/bottombar/card_b.png'),
                  text: 'کارت ها',
                },
                statusBar: statusBar,
              },
            },
            options: {
              statusBar: statusBar,
            },
          },
          {
            stack: {
              id: Screens.WalletStack,
              children: [
                {
                  component: {
                    id: Screens.Wallet,
                    name: Screens.Wallet,
                    options: {
                      statusBar: statusBar,
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  icon: require('../Assetes/bottombar/wallet.png'),
                  selectedIcon: require('../Assetes/bottombar/wallet_b.png'),
                  text: 'کیف پول',
                },
                statusBar: statusBar,
              },
            },
            options: {
              statusBar: statusBar,
            },
          },
          {
            stack: {
              id: Screens.ProfileStack,
              children: [
                {
                  component: {
                    id: Screens.Profile,
                    name: Screens.Profile,
                    options: {
                      statusBar: statusBar,
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  icon: require('../Assetes/bottombar/profile.png'),
                  selectedIcon: require('../Assetes/bottombar/profile_b.png'),
                  text: 'حساب کاربری',
                },
                statusBar: statusBar,
              },
            },
            options: {
              statusBar: statusBar,
            },
          },
        ],
        options: {
          bottomTab: {
            textColor: '#312C2C',
            selectedTextColor: '#6498E6',
          },
          statusBar: statusBar,
        },
      },
    },
  });
}
export function resetToScreen(screen = '', options = {}, headerProps = {}) {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              id: screen,
              name: screen,
              options: {
                // Optional options object to configure the screen
                topBar: tabBarSetting,
                statusBar: statusBar,
                ...options,
              },
            },
          },
        ],
        options: {},
      },
      options: {
        statusBar: statusBar,
      },
    },
  });
}
export function navigateToDeepLinkPage(remoteMessage = null) {
  if (__DEV__) {
    console.log(
      'log:: >>>>> navigateToDeepLinkPage >>>> ',
      remoteMessage.data.DeepLink,
      remoteMessage,
    );
  }
  if (remoteMessage && remoteMessage.hasOwnProperty('data')) {
    const Screen = remoteMessage.data.DeepLink.toString();
    /**
     * deep link to deposit or Main page
     */
    const hideTabBarAndBottomBar = Object.assign(
      {},
      tabBarSetting,
      hideBottomBar,
      {statusBar: statusBar, animations: navAnimation},
    );
    const stack = [];
    if (Screen.indexOf(Screens.Deposit.replace(CRMRN, '')) > -1) {
      stack.push({
        id: 'xxx01',
        component: {
          id: Screens.Deposit,
          name: Screens.Deposit,
          options: hideTabBarAndBottomBar,
        },
      });
      /**
       * get daily wallet logs
       */
    } else if (Screen.indexOf(Screens.Notifications.replace(CRMRN, '')) > -1) {
      if (
        remoteMessage.data.hasOwnProperty('id') &&
        remoteMessage.data.id !== null
      ) {
        stack.push({
          id: 'xxx02',
          component: {
            id: Screens.NotificationDetail,
            name: Screens.NotificationDetail,
            options: hideTabBarAndBottomBar,
            passProps: {
              item: {
                id: remoteMessage.data.id,
                seen: 0,
              },
            },
          },
        });
      } else {
        stack.push({
          id: 'xxx03',
          component: {
            id: Screens.Notifications,
            name: Screens.Notifications,
            options: hideTabBarAndBottomBar,
          },
        });
      }
    }
    resetToMainScreen(stack);
  }
}
export function deepLink() {
  const NativeLinking =
    Platform.OS === 'android'
      ? require('react-native/Libraries/Linking/NativeLinking').default
      : Linking;
  NativeLinking.getInitialURL()
    .then(url => {
      if (__DEV__) {
        console.log('log:::  ??????? NativeLinking.getInitialURL()', url);
      }
      if (url !== null) {
        navigateToDeepLinkPage({data: {DeepLink: url}});
        /**
         * deep link to deposit page
         */
      } else {
      }
    })
    .catch(e => {});
}
let menuState = 'hide';
export function toggleMenu(componentId = null, visible = true) {
  if (visible === true && menuState === 'hide') {
    menuState = 'visible';
    RNNDrawer.showDrawer({
      component: {
        name: Screens.Menu,
        passProps: {
          animationOpenTime: 300,
          animationCloseTime: 300,
          direction: 'right',
          dismissWhenTouchOutside: true,
          fadeOpacity: 0.6,
          // drawerScreenHeight: '100%',
          style: {
            // Styles the drawer container, supports any react-native style
          },
          parentComponentId: componentId ? componentId : Screens.Main, // Custom prop, will be available in your custom drawer component props
        },
        options: {
          statusBar: statusBar,
        },
      },
    });
  } else {
    menuState = 'hide';
    RNNDrawer.dismissDrawer();
  }
}
export function setNavigationDefaultOptions(bottomTabsOptions = {}) {
  Navigation.setDefaultOptions({
    bottomTabs: {
      titleDisplayMode: 'alwaysShow',
      tabsAttachMode: 'onSwitchToTab',
    },
    bottomTab: {
      fontFamily: Font.Vazir,
      selectedTextColor: '#6498E6',
      textColor: '#8c97a3',
    },
    layout: {
      orientation: ['portrait'],
      backgroundColor: '#fff',
    },
    statusBar: statusBar,
    topBar: {
      visible: false,
      height: 0,
    },
  });
}

/**
 *
 *
 * some functions for
 * handle back in bottom tabs
 *
 *
 */
const tabIndexes = {
  '0': Screens.DrawerStack,
  '1': Screens.CardStack,
  '2': Screens.WalletStack,
  '3': Screens.ProfileStack,
};
const stack = [];
export function handleBackHandler() {
  return handleBottomTabBackHandler();
}
export function handleBottomTabSelect(e) {
  // const {selectedTabIndex, unselectedTabIndex} = e;
  const {selectedTabIndex} = e;
  if (stack.length === 0 || stack[stack.length - 1] !== selectedTabIndex) {
    stack.push(selectedTabIndex);
  }
  //alert(JSON.stringify(stack));
}
export function handleBottomTabBackHandler() {
  if (stack.length > 1) {
    Navigation.mergeOptions(tabIndexes[stack[stack.length - 1]], {
      bottomTabs: {currentTabId: tabIndexes[stack[stack.length - 2]]},
    });
  } else if (stack.length === 1) {
    Navigation.mergeOptions(tabIndexes[stack[stack.length - 1]], {
      bottomTabs: {currentTabId: tabIndexes['0']},
    });
  } else {
    // reset to main
    Navigation.mergeOptions(Screens.Main, {
      bottomTabs: {currentTabId: tabIndexes['0']},
    });
  }
  if (stack.length > 0) {
    stack.pop();
  }
  //alert(JSON.stringify(stack));
}
