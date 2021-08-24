import { redisOptions } from "./redisOptions.config";

const BeeQueue = require('bee-queue');

export const queueDefault = new BeeQueue('default', redisOptions);