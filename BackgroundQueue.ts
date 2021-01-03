import queueFactory from 'react-native-queue-asyncstorage';
import {
  BackgroundQueueErrorEnum,
  KeyValuePairs,
  QueueState,
} from '~/Queue/types';

export class BackgroundQueue {
  private queueState: QueueState = 'inactive';
  private queue: any | null = null;
  constructor() {
    this.initializeQueue();
  }
  async initializeQueue() {
    this.queue = await queueFactory();
    return Promise.resolve(true);
  }
  startQueue() {
    // Start queue to process any jobs that hadn't finished when app was last closed.
    this.queue.start();
  }

  addWorker(
    workerName: string,
    worker: (id: number, payload: KeyValuePairs) => void,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.checkQueueInitialized()) {
        return reject({
          workerName: workerName,
          error: BackgroundQueueErrorEnum.add_worker_failed,
        });
      }
      this.queue.addWorker(
        workerName,
        async (id: number, payload: KeyValuePairs) => {
          try {
            await worker(id, payload);
            await new Promise(resolve => {
              setTimeout(() => {
                resolve({workerId: id, workerPayload: payload});
              }, 5);
            });
          } catch (e) {
            reject({
              workerId: id,
              workerPayload: payload,
              error: BackgroundQueueErrorEnum.worker_execute_error,
            });
          }
        },
      );
    });
  }
  createJob(jobName: string, payload: KeyValuePairs) {
    if (!this.checkQueueInitialized()) {
      return;
    }
    this.queue.createJob(jobName, payload);
  }
  getQueueState(): string {
    return this.queueState;
  }
  setQueueState(state: QueueState): void {
    this.queueState = state;
  }
  resetQueue(): void {
    this.initializeQueue();
    this.startQueue();
  }
  checkQueueInitialized(): boolean {
    return this.queue !== null;
  }
}
