import { combineLatest, connect } from 'rxjs';

const dtmfArray = [];

export class DTMFHelper {
  constructor() {}

  startDTMF(conn, uuid:string) {
    try {
      console.log('STARTING DTMF...');
      conn.execute('start_dtmf', uuid);
    } catch (err) {
      console.log('ERROR -> ', err);
    }
  }

  stopDTMF(conn, uuid:string) {
    try {
      console.log('STOP DTMF...');
      conn.execute('stop_dtmf', uuid);
    } catch (err) {
      console.log('ERROR -> ', err);
    }
  }

  processDTMF(dtmfDigit,conn) {
    // insert logic here on how you want to process the
    // dtmf-digit received.

    if (dtmfDigit === "#"){
        const ext = dtmfArray.join('');
        console.log(`Ext process -> ${ext}`);

        conn.execute('bridge', `sofia/gateway/fs-test1/${ext}`);

        //clear the dtmfArray after call is dispatched
        dtmfArray.splice(0, dtmfArray.length);
    }
    else{
        dtmfArray.push(dtmfDigit);
        console.log('DTMF digit -> ', dtmfDigit);
        console.log('DTMF array -> ', dtmfArray);
    }
  }

  captureDTMF(conn, uuid: string) {
    conn.on('esl::event::DTMF::*', (evt) => {
      const dtmfDigit = evt.getHeader('DTMF-Digit');

      console.log(`UUID -> ${uuid} , 
                        DIGIT -> ${dtmfDigit} , 
                        DTMF ARRAY LENGTH -> ${dtmfArray}`);

      // conn.execute('send_dtmf', '1', uuid);

      // conn.execute('play_and_get_digits', `1 5 1 3000 * ivr/ivr-finished_pound_hash_key.wav ivr/ivr-that_was_an_invalid_entry.wav`, uuid);

    // conn.execute('bind_digit_action' , 
    //             'my_digits, 1500, exec:playback,https://crm.dealerownedsoftware.com/hosted-files/audio/ConvertedSalesService.wav', uuid, () => {
    //                 console.log('executed digit');

    //     conn.execute('digit_action_set_realm', 'my_digits', uuid, () => {
    //         conn.execute('set', 'bind_digit_input_timeout=5000', uuid, () => {
    //             console.log('timeout -> ');
    //         });
    //     });
    // });
    
    //   conn.execute('digit_action_set_realm', 'my_digits', uuid, () => {

    //     conn.execute('set', 'bind_digit_input_timeout=5000', uuid, () => {
    //         console.log('TIMEOUT');
    //     });

    //     conn.execute(
    //         'bind_digit_action',
    //         'my_digits, 1500, exec:playback,https://crm.dealerownedsoftware.com/hosted-files/audio/ConvertedSalesService.wav', uuid, (r) => {
    //             // console.log('DIG' , r);
    //     });
    //   });


  

    //    conn.execute('play_and_get_digits',`1 3 2 3000 # ivr/ivr-that_was_an_invalid_entry.wav silence_stream://250 res \\dt+`, uuid);

    //   switch(dtmfDigit){
    //       case '2' :
    //           if (dtmfArray.length === 0){

    //               console.log('TRYING TO BRIDGE THE CALL...');

    //               //insert bridge here...

    //               dtmfArray.splice(0, dtmfArray.length);

    //               break;
    //           }

    //       case '3' :
    //           if (dtmfArray.length === 0){
    //               console.log('TRYING TO CONNECT TO IVR...');

    //               //execute IVR
    //               conn.execute('ivr', 'vena-ivr', uuid);

    //               dtmfArray.splice(0, dtmfArray.length);

    //               break;
    //           }

    //       case '4' :
    //           if (dtmfArray.length === 0){

    //               console.log('PLAY RECORDING...');

    //               // conn.execute('playback', 'http://crm.dealerownedsoftware.com/hosted-files/ivr-rec-2/WelcomeMessage.mp3');

    //               conn.execute('playback', 'https://crm.dealerownedsoftware.com/hosted-files/audio/ConvertedSalesService.wav', uuid);

    //               break;
    //           }

    //       default:
    //           this.processDTMF(dtmfDigit,conn);

    //           conn.execute('playback', 'http://crm.dealerownedsoftware.com/hosted-files/ivr-rec-2/FailedRetryMessage.mp3', uuid);

    //           break;
    //   }
    });
  }
}
