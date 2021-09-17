import { OutboundCallService } from 'src/modules/outbound-call/services/outbound-call.service';
import { CHANNEL_VARIABLE } from '../constants/channel-variables.constants';
import { ESL_SERVER, FS_ESL } from '../constants/fs-esl.constants';
import esl from 'modesl';
import { TimeProvider  } from 'src/utils/timeProvider.utils';

export class ClickToCallServerHelper {
  
  constructor(
    private readonly _outboundCallService: OutboundCallService
  ) {}

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

      // let hangupEvent = 'esl::event::CHANNEL_HANGUP::' + legId;

      let hangupEvent = 'esl::event::CHANNEL_HANGUP_COMPLETE::**';

      let hangupCompleteWrapper = (esl) => {
        legStop = true;
        console.log('Leg-A hangup');
        console.log('CHANNEL STATE ', esl.getHeader('Channel-State'));
        console.log(`UID HANGUP COMPLETE -> ${esl.getHeader('Unique-ID')}`);
        console.log('EVNT -> ', JSON.stringify(esl));
        conn.removeListener(hangupEvent, hangupCompleteWrapper);
      };

      conn.on(hangupEvent, hangupCompleteWrapper);

      conn.subscribe('CHANNEL_HANGUP_COMPLETE');
      
      conn.on('error', (err) => {
        console.log('ERROR - ', err);
      });
      
      conn.on('esl::end', () => {
        console.log('ESL SERVER END -> ', legId);
      })

      conn.subscribe('all');

      conn.on(FS_ESL.RECEIVED, (evt) => {
        console.log('CHANNEL STATE ', evt.getHeader('Channel-State'));
        console.log(`CTC EVENT NAME -> ${evt.getHeader('Event-Name')} , 
                Uid -> ${evt.getHeader('Unique-ID')}`);
      });

      if (!legStop) {

      let toUnixTimeSeconds = `${new TimeProvider().getUnixTimeSeconds()}`;

      let filePath = '$${outbound_record_dir}/${uuid}';

      let fullPath = `${filePath}_${toUnixTimeSeconds}.mp3`;

      conn.execute('playback', 'https://crm.machaik.net/csvoice.mp3', () => {
        console.log('playback executed');

          conn.execute('record_session', fullPath, () => {
            conn.execute('sleep', 2000, () => {
              console.log('sleep executed' );
              conn.execute('bridge', 'sofia/gateway/fs-test1/1003', (cb2) => {
                console.log('bridge completed');
                console.log('B-Leg', cb2.getHeader(CHANNEL_VARIABLE.UNIQUE_ID));
              });
            });
          });
      });
     
      

      // conn.execute('playback', 'https://crm.dealerownedsoftware.com/hosted-files/audio/ConvertedSalesService.wav', () => {
      //   console.log('playback executed');

      //   conn.execute('sleep', '10000', () => {
      //     console.log('sleep executed');
      //   })

      //   // conn.execute('bridge', 'sofia/gateway/fs-test3/1000', (cb) => {
      //   //   console.log('bridge completed');
      //   //   console.log('B-Leg', cb.getHeader(CHANNEL_VARIABLE.UNIQUE_ID));
      //   // });
      // });

      // conn.execute('record_session', '$${sample_record_dir}/${strftime(%Y-%m-%d-%H-%M-%S)}_${uuid}.wav', (record) => {

      //     console.log('start recording... -> ');

      //     conn.execute('playback', 'ivr/ivr-recording_started.wav', () => {
      //         console.log('playback executed');

      //         conn.execute('playback', 'https://crm.dealerownedsoftware.com/hosted-files/audio/ConvertedSalesService.wav', () => {

      //       console.log('playback executed');
  
      //       conn.execute(
      //         'sleep',
      //         '5000',
      //         () => {
  
      //         console.log('1. sleep executed ' + new Date());
  
      //           if (legStop) {
      //             console.log('Leg has stop', legStop);
      //             return;
      //           }

      //           conn.execute('speak', 'flite|kal|We are now connecting you to our team. Please hold!', () => {
      //             console.log('SPEAK EXECUTED');

      //             conn.execute('sleep', '3000', async () => {
  
      //               console.log('2. sleep executed ' + new Date());
    
      //               if (legStop) {
      //                 console.log('Execution break', legStop);
      //                 return;
      //               }
  
      //               var phoneNumberTo = await this._outboundCallService.getPhoneNumberToByUUID(legId);
  
      //               console.log('PHONE NUMBER TO -> ', phoneNumberTo);
    
      //               let var_name = 'regex';
    
      //               conn.execute('play_and_get_digits', `1 5 2 10000 # ivr/ivr-enter_destination_telephone_number.wav ivr/ivr-that_was_an_invalid_entry.wav ${var_name} ${phoneNumberTo} 2000`, (e) => {
    
      //                 let validValue = e.getHeader(`variable_${var_name}`);
    
      //                 let invalidValue = e.getHeader(`variable_${var_name}_invalid`);
    
      //                 if (validValue != null || validValue != undefined){
      //                     console.log('VALID -> ', validValue);
      //                     conn.execute('bridge', 'sofia/gateway/fs-test3/${regex}');
      //                 }
      //                 else
      //                 {
      //                     console.log('INVALID -> ', invalidValue);
    
      //                     conn.execute('sleep', '3000', () => {
      //                         console.log('3. Sleep executed . ' + new Date());
      //                     });
      //                 }
  
      //                 conn.execute('play_and_get_digits', `1 5 2 10000 # ivr/ivr-enter_destination_telephone_number.wav ivr/ivr-that_was_an_invalid_entry.wav ${var_name} ${phoneNumberTo} 2000`, (e) => {
                      
      //                 });
      //               });
      //             });
      //           });
      //         },
      //       );
      //     });
      //     });
      //   });
      }
    });
  }
}
