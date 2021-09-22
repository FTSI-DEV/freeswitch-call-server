import { CHANNEL_VARIABLE } from "../../constants/channel-variables.constants";

var dtmfArray : string[] = [];

export class InboundCallDTMFHelper{

    constructor() {}

    startDTMF(conn){
        try{
            conn.execute('start_dtmf');
            console.log('DTMF STARTED');
        }   
        catch(err){     
            console.log('ERROR -> ', err);
        }
    }

    stopDTMF(conn){
        try{
            conn.execute('stop_dtmf');
            console.log('DTMF STOPPED');
        }
        catch(err){
            console.log('ERROR -> ', err);
        }
    }

    captureDTMF(conn,dtmfEvent:string){
        conn.on(dtmfEvent, (evt) => {
            
            let dtmfDigit = evt.getHeader('DTMF-Digit');

            conn.execute('log', 'Log -> ${target_num}', () => {

                if (dtmfDigit === '#'){

                    console.log('LENGTH -> ' ,dtmfArray.length);

                    if (dtmfArray.length === 1){

                        let digit = dtmfArray[0];

                        switch(digit){
                            case '1' : 
                                console.log('Digit entered -> ' , digit);

                                conn.execute('sleep', '2000', () =>{
                                    console.log('Sleep executed - ' + new Date());
                                });

                                dtmfArray.splice(0, dtmfArray.length);

                                break;

                            case '2' : 
                                console.log('Digit entered -> ', digit);

                                conn.execute('playback', 'https://crm.dealerownedsoftware.com/hosted-files/ivr-rec-2/WelcomeMessage.mp3', () => {
                                    console.log('playback executed ');
                                });

                                dtmfArray.splice(0, dtmfArray.length);

                                break;

                            case '3' :
                                console.log('Digit enterd -> ', digit);
                                
                                conn.execute('playback', 'ivr/ivr-that_was_an_invalid_entry.wav', () => {
                                    console.log('playback invalid entry executed');
                                });

                                dtmfArray.splice(0, dtmfArray.length);

                                break;
                        }

                        console.log('DTMF array length -> ', dtmfArray);
                    }
                    else if (dtmfArray.length >= 1 ){
                        console.log('DTMF array length -> ', dtmfArray);
                        conn.execute('sleep', '1000', () => {
                            conn.execute('bridge', 'sofia/gateway/fs-test3/${target_num}');
                        });

                        dtmfArray.splice(0, dtmfArray.length);
                        
                    }
                }
                else{

                    dtmfArray.push(dtmfDigit);
                }
            });

            // conn.execute('set', 'bind_digit_input_timeout=5000', () => {
            //     console.log('bind input timeout set completed.');

            //     conn.execute('bind_digit_action',
            //                  'my_digits, 1000, exec:bridge,sofia/gateway/fs-test3/1000',(cb)=> {
            //                      console.log('success bind digit action');

            //                      console.log('B-Leg ', cb.getHeader(CHANNEL_VARIABLE.UNIQUE_ID));

            //                      conn.execute('digit_action_set_realm', 'my_digits', () =>{
            //                          console.log('digit set realm completed');
            //                      });
            //                  });
            // });
        });
    }
}