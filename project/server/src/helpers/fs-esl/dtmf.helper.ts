const dtmfArray = [];

export class DTMFHelper{

    constructor(
    ){}

    startDTMF(conn)
    {
        try{
            console.log('STARTING DTMF...');
            conn.execute('start_dtmf');
        }
        catch(err){
            console.log('ERROR -> ', err);
        }
    }

    processDTMF(dtmfDigit){
        // insert logic here on how you want to process the 
        // dtmf-digit received.
        dtmfArray.push(dtmfDigit);
        console.log('DTMF digit -> ', dtmfDigit);
        console.log('DTMF array -> ', dtmfArray);
    }

    captureDTMF(conn, uuid:string){

        conn.on("esl::event::DTMF::*", (evt) => {
            
            const dtmfDigit = evt.getHeader('DTMF-Digit');

            console.log(`UUID -> ${uuid} , 
                        DIGIT -> ${dtmfDigit} , 
                        DTMF ARRAY LENGTH -> ${dtmfArray}`);

            switch(dtmfDigit){
                case '2' : 
                    if (dtmfArray.length === 0){

                        console.log('TRYING TO BRIDGE THE CALL...');

                        //insert bridge here...

                        dtmfArray.splice(0, dtmfArray.length);

                        break;
                    }

                case '3' :
                    if (dtmfArray.length === 0){
                        console.log('TRYING TO CONNECT TO IVR...');
                        
                        //execute IVR
                        conn.execute('ivr', 'vena-ivr', uuid);

                        dtmfArray.splice(0, dtmfArray.length);

                        break;
                    }
                
                case '4' :
                    if (dtmfArray.length === 0){

                        console.log('PLAY RECORDING...');

                        // conn.execute('playback', 'http://crm.dealerownedsoftware.com/hosted-files/ivr-rec-2/WelcomeMessage.mp3');

                        conn.execute('playback', 'https://crm.dealerownedsoftware.com/hosted-files/audio/ConvertedSalesService.wav', uuid);

                        break;
                    }
                
                default:
                    this.processDTMF(dtmfDigit);

                    conn.execute('playback', 'http://crm.dealerownedsoftware.com/hosted-files/ivr-rec-2/FailedRetryMessage.mp3', uuid);

                    break;
            }
        })
    }
}