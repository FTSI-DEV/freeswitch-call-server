import { CHANNEL_VARIABLE } from '../constants/channel-variables.constants';
import { EVENT_LIST } from '../constants/event-list.constants';
import { ESL_SERVER, FS_ESL } from '../constants/fs-esl.constants';
import { DTMFHelper } from './dtmf.helper';

const esl = require('modesl');

export class ClickToCallServerHelper {
  startClickToCallServer() {
    let server = new esl.Server(
      {
        port: 8000,
        host: '0.0.0.0',
        myevents: true,
      },
      () => {
        console.log('CLICK TO CALL SERVER is up!!');
      },
    );

    server.on(ESL_SERVER.CONNECTION.READY, (conn) => {

      console.log('CLICK TO CALL - server ready');

      var legId = conn.getInfo().getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

      console.log('LEG ID - ', legId);

      let legStop = false;

      let hangupEvent = 'esl::event::CHANNEL_HANGUP::' + legId;

      conn.subscribe('DTMF');

      conn.subscribe('events:all');

      conn.on(FS_ESL.RECEIVED, (evt) => {
        console.log('CLICK TO CALL -> ', evt.headers.find(e => e.name === EVENT_LIST.EVENT_NAME));
      });

      let hangupCompleteWrapper = (esl) => {
        legStop = true;
        console.log('Leg-A hangup');
        conn.removeListener(hangupEvent, hangupCompleteWrapper);
      };

      conn.on(hangupEvent, hangupCompleteWrapper);

      conn.subscribe('CHANNEL_HANGUP');
      
      conn.on('error', (err) => {
        console.log('ERROR - ', err);
      });

      if (!legStop) {
  
        // dtmfHelper.startDTMF(conn);

        conn.execute('sleep', '5000', () => {

          console.log('1. sleep executed ' + new Date());

          conn.execute(
            'playback',
            'https://crm.dealerownedsoftware.com/hosted-files/audio/ConvertedSalesService.wav',
            () => {

              console.log('playback executed');

              if (legStop) {
                console.log('Leg has stop', legStop);
                return;
              }

              conn.execute('sleep', '3000', () => {

                console.log('2. sleep executed ' + new Date());

                if (legStop) {
                  console.log('Execution break', legStop);
                  return;
                }

                conn.execute('bridge', 'sofia/gateway/fs-test3/1000', (cb) => {

                  console.log('bridge execute complete');

                  console.log('B-Leg ', cb.getHeader(CHANNEL_VARIABLE.UNIQUE_ID));
                });
              });
            },
          );
        });
      }
    });

    // server.on(ESL_SERVER.CONNECTION.READY, (conn) => {

    //   console.log('OUTBOUND ESL - CLICK-TO-CALL - server ready');

    //   var legId = conn.getInfo().getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

    //   console.log('LEG ID - ', legId);

    //   let legStop = false;

    //   let hangupEvent = 'esl::event::CHANNEL_HANGUP::' + legId;

    //   let hangupCompleteWrapper = (esl) => {
    //     legStop = true;
    //     console.log('Leg-A hangup');
    //     // conn.on('stop_dtmf');
    //     conn.removeListener(hangupEvent, hangupCompleteWrapper);
    //   };

    //   conn.on(hangupEvent, hangupCompleteWrapper);

    //   // conn.subscribe('all');

    //   // conn.on('esl::event::*::*', (evt) => {
    //   //   console.log('OUTBOUND ESL EVENT NAME -> ', evt);
    //   // });

    //   // conn.on('esl::event::DTMF::*', (evt) => {
    //   //   console.log('DTMF -> ', evt);
    //   //   conn.execute(
    //   //     'play_and_get_digits',
    //   //     `1 5 1 3000 # ivr/ivr-finished_pound_hash_key.wav '' 2 5000 1000 XML default`,
    //   //     (e) => {
    //   //       console.log('TEST -> ', e);
    //   //     },
    //   //   );
    //   // });

    //   // conn.subscribe('DTMF');

    //   conn.subscribe('CHANNEL_HANGUP_COMPLETE');

    //   conn.on('error', (err) => {
    //     console.log('ERROR - ', err);
    //   });

    //   if (!legStop) {

    //     console.log('LEG' , legStop);

    //       conn.execute('sleep', '3000', () => {

    //       conn.execute('playback','https://crm.dealerownedsoftware.com/hosted-files/audio/ConvertedSalesService.wav',() => {
    //           if (legStop) {
    //             console.log('Leg has stop', legStop);
    //             return;
    //           }

    //           console.log('playback executed', legStop);

    //           conn.execute('sleep', '5000', () => {
    //             if (legStop) {
    //               console.log('Execution break', legStop);
    //               return;
    //             }

    //             console.log('1. executed sleep', new Date());

    //             conn.execute('sleep', '2000', () => {
    //               if (legStop) {
    //                 console.log('Execution break', legStop);
    //                 return;
    //               }

    //               console.log('2. executed sleep', new Date());

    //               conn.execute(
    //                 'bridge',
    //                 'sofia/gateway/fs-test3/1000',
    //                 (cb) => {
    //                   console.log('bridge execute complete');
    //                   console.log(
    //                     'B-Leg ',
    //                     cb.getHeader(CHANNEL_VARIABLE.UNIQUE_ID),
    //                   );
    //                 },
    //               );

    //               console.log('HEELO WORLD');
    //             });
    //           });
    //         },
    //       );
    //       });
    //   }
    // });
  }
}
