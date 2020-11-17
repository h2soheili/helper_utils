import {BranchSubscriber} from 'react-native-branch';
import {logToConsole} from '../helpers';
const subscriber = new BranchSubscriber({
  onOpenStart: e => {},
  onOpenComplete: ({error, params, uri}) => {},
});

subscriber.subscribe();
