const Bee = require('bee-queue');


// Select ports that are unlikely to be used by other services a developer might be running locally.
const REDIS_SERVER_PORT = 6379;

export default {
      Bee,
      queues: [
        {
          name: 'default',
          hostId: 'default',
          type: 'bee',
          redis:{
            host: process.env.REDIS_SERVER_HOST,
            port: process.env.REDIS_SERVER_PORT
          }
        }
      ],
      customCssPath: 'https://example.com/custom-arena-style.css',
      customJsPath: 'https://example.com/custom-arena-js.js'
    }

