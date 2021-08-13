const Bee = require('bee-queue');


// Select ports that are unlikely to be used by other services a developer might be running locally.
const REDIS_SERVER_PORT = 6379;

export default {
      Bee,
      queues: [
        {
          // Required for each queue definition.
          name: 'callEnter',
          // User-readable display name for the host. Required.
          hostId: 'callEnter',
          // Queue type (Bull or Bee - default Bull).
          type: 'bee',  
          redis: {
            host: '127.0.0.1',
            port: REDIS_SERVER_PORT,
          },
        },
          {
          // Required for each queue definition.
          name: 'callVerify',
          // User-readable display name for the host. Required.
          hostId: 'callVerify',
          // Queue type (Bull or Bee - default Bull).
          type: 'bee',  
          redis: {
            host: '127.0.0.1',
            port: REDIS_SERVER_PORT,
          },
        },
         {
          // Required for each queue definition.
          name: 'waitinngToConnect',
          // User-readable display name for the host. Required.
          hostId: 'waitinngToConnect',
          // Queue type (Bull or Bee - default Bull).
          type: 'bee',  
          redis: {
            host: '127.0.0.1',
            port: REDIS_SERVER_PORT,
          },
        }
      ],
      customCssPath: 'https://example.com/custom-arena-style.css',
      customJsPath: 'https://example.com/custom-arena-js.js'
    }

