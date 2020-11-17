import {StyleSheet, Platform} from 'react-native';
import {scaleFontSize} from '../Utils/window';
import Font from '../Constants/font';
interface Style {
  container: {backgroundColor: string; flex: number};
  rightText: {alignSelf: string; textAlign: string};
  centerText: {alignSelf: string; textAlign: string};
  pinStyles: {
    top: number;
    left: number;
    bottom: number;
    width: number;
    position: string;
    right: number;
    height: number;
  };
  box1: {alignItems: string; flex: number; justifyContent: string};
  leftText: {alignSelf: string; textAlign: string};
  row: {alignItems: string; flexDirection: string; justifyContent: string};
  textStyle: {
    fontFamily: string;
    color: string;
    textAlign: string | undefined;
    fontSize: number;
  };
  pinContainer: {width: number; height: number};
}
export const commonStyles: Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: Font.Vazir,
    fontSize: scaleFontSize(20),
    color: '#3f3f3d',
    textAlign: Platform.select({
      ios: 'right',
      android: 'right',
    }),
  },
  box1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftText: {
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  rightText: {
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  centerText: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  pinContainer: {
    width: 50,
    height: 50,
  },
  pinStyles: {
    height: 32,
    width: 32,
    // resizeMode:'cover'
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  flex1: {
    flex: 1,
  },
});
const fileUri: string | undefined = Platform.select({
  ios: `${Font.VazirLight}.ttf`,
  android: `file:///android_asset/fonts/${Font.VazirLight}.ttf`,
});
export const WebViewTypeFace: string = `
      @font-face {
      font-family: '${Font.VazirLight}';
        src: local('${Font.VazirLight}'), url('${fileUri}') format('truetype');
      }    
      *,body,p,h1,h2,h3,h4{
        font-family:${Font.VazirLight}; 
      }
      `;

// export const WebViewTypeFace = `
//       @font-face {
//       font-family: ${Font.VazirLight};
//       src:local(${Font.VazirLight}), url(${
//     Platform.OS === 'ios'
//         ? `${Font.VazirLight}.ttf`
//         : `file:///android_asset/fonts/${Font.VazirLight}.ttf`
// }) format("truetype");
//       }
//       @font-face {
//       font-family: ${Font.Vazir};
//       src:local(${Font.Vazir}), url(${
//     Platform.OS === 'ios'
//         ? `${Font.Vazir}.ttf`
//         : `file:///android_asset/fonts/${Font.Vazir}.ttf`
// }) format("truetype");
//     }
//       @font-face {
//       font-family: ${Font.VazirBold};
//       src:local(${Font.VazirBold}), url(${
//     Platform.OS === 'ios'
//         ? `${Font.VazirBold}.ttf`
//         : `file:///android_asset/fonts/${Font.VazirBold}.ttf`
// }) format("truetype");
//       }
//       *,body,p,h1,h2,h3,h4{
//         font-family:${Font.VazirLight},Arial;
//       }
//
//       `;
