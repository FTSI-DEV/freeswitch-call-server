
export interface IBeeQueueJob<T>{
    trigger(parameter: T);
}