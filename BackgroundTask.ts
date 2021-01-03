import BackgroundTask from 'react-native-background-task';
import {BackgroundQueue} from './BackgroundQueue';
import {KeyValuePairs} from '~/Queue/types';
import {API} from '~/Constants/api';

BackgroundTask.define(async () => {
  // Init queue
  const BackgroundQueueInstance = new BackgroundQueue();

  const syncPinsWorker = (workerId: number, workerPayload: KeyValuePairs) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('log:::syncPinsWorker', workerId, workerPayload);
        fetch(API + 'app_start')
          .then(res => res.json())
          .then(response => {
            console.log('log::', response);
          })
          .catch(e => {
            console.log('log::', e);
          })
          .finally(_ => {
            resolve(true);
          });
      }, 1000);
    });
  };

  BackgroundQueueInstance.addWorker('app_start', syncPinsWorker)
    .then(res => {
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    });
  BackgroundQueueInstance.createJob('app_start', {key: 'value'});
  // Start the queue with a lifespan
  // IMPORTANT: OS background tasks are limited to 30 seconds or less.
  // NOTE: Queue lifespan logic will attempt to stop queue processing 500ms less than passed lifespan for a healthy shutdown buffer.
  // IMPORTANT: Queue processing started with a lifespan will ONLY process jobs that have a defined timeout set.
  // Additionally, lifespan processing will only process next job if job.timeout < (remainingLifespan - 500).
  await BackgroundQueueInstance.startQueue(); // Run queue for at most 20 seconds.
  // finish() must be called before OS hits timeout.
  console.log('log::::BackgroundTask.finish()');
  BackgroundTask.finish();
});
export {BackgroundTask};
