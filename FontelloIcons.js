//load icons created with fontello in react native with react-native-vector-icons

import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../../fontello/config.json';
export const FontelloIcons = createIconSetFromFontello(fontelloConfig);
