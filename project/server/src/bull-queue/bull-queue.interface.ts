import { Job } from "bull";

export interface IBullQueue{
    trigger(parameter: Job);
}