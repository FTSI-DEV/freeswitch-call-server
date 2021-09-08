
var dtmfArray = [];

export class ClickToCallDTMFHelper{

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

    processDTMF(dtmfDigit, conn){
        if (dtmfDigit === "#"){
            let phoneNumber = dtmfArray.join('');
            console.log('Ext process -> ', phoneNumber);

            //add validation before bridging...
            conn.execute('bridge', `sofia/gateway/fs-test1/${phoneNumber}`);

            //clear the dtmfArray after call is dispatched.
            dtmfArray.splice(0, dtmfArray.length);
        }
        else{
            dtmfArray.push(dtmfDigit);
        }
    }

    captureDTMF(conn){
        conn.on('esl::event::DTMF::*', (evt) => {
            
            let dtmfDiit = evt.getHeader('DTMF-Digit');

            conn.execute('play_and_get_digits', `1 5 1 3000 * ivr/ivr-finished_pound_hash_key.wav ivr/ivr-that_was_an_invalid_entry.wav '' 1 5000`);
        });
    }
}