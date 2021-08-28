const Bee = require('bee-queue');
const Bull = require('bull');

export default {
      Bull,
      queues: [
        {
          name: 'default',
          hostId: 'default',
          type: 'bull',
          redis:{
            host: process.env.REDIS_SERVER_HOST,
            port: process.env.REDIS_SERVER_PORT
          }
        }
      ],
      customCssPath: 'https://example.com/custom-arena-style.css',
      customJsPath: 'https://example.com/custom-arena-js.js'
    }

