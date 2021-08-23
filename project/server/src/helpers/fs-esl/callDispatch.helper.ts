import { OriginationModel } from "./models/originate.model";

export class CallDispatchHelper{
    
    clickToCall(conn, originateParam: OriginationModel){
        try{
            // let app_args = `sofia/gateway${originateParam.gateway1}/${originateParam.extensionGateway1}`;
            // let arg1 = `{ignore_early_media=${originateParam.appArgs},origination_caller_id_number=${originateParam.originationNumber},hang_up_after_bridge=true}${app_args}`;
            // let arg2 = `${arg1} &bridge(sofia/gateway/${originateParam.gateway2}/${originateParam.extensionGateway2})`;

            // let app_args = 'sofia/gateway/fs-test2/1000';//destinationNumber;
            // let arg1 = `{ignore_early_media=true,origination_caller_id_number=${originateParam.phoneNumberFrom},hang_up_after_bridge=true}${app_args}`;
            // let arg2 = `${arg1} &bridge(${originateParam.phoneNumberTo})`;
            
            // conn.api('originate', arg2, function(res){
            //     console.log('Originate', res.getBody());
            // });

            let app_args = `sofia/gateway/fs-test1/${originateParam.phoneNumberFrom}`;
            let arg1 = `{ignore_early_media=true,origination_caller_id_number=+17132633132}${app_args}`;
            let arg2 = `${arg1} &bridge(sofia/gateway/fs-test3/${originateParam.phoneNumberTo})`;
            
            conn.api('originate', arg2, function(res){

                let callUid = res.getBody().toString().replace('+OK ', '');

                conn.execute(
                    'playback',
                    'https://crm.dealerownedsoftware.com/hosted-files/audio/ConvertedSalesService.wav',
                    callUid
                  );
            })

            //call webhook

        }catch(err){
            console.log('Originating Call Error -> ', err);
        }
    }

    async clickToCall2(conn, phoneNumberTo:string,phoneNumberFrom:string,callerId:string):Promise<string>{

        try{


            console.log('CLICK TO CALL SERVICE', conn);

            let app_args = 'sofia/gateway/fs-test2/1000';//destinationNumber;
            let arg1 = `{ignore_early_media=true,origination_caller_id_number=${phoneNumberFrom},hang_up_after_bridge=true}${app_args}`;
            let arg2 = `${arg1} &bridge(sofia/gateway/fs-test3${phoneNumberTo})`;

            // console.log('connection? ', conn);

            // conn.execute('set', `outbound_caller_id_number=${callerId}`);

            await conn.api('originate', arg2, function(res){

                let callUid = res.getBody();

                console.log('Originate', callUid);

                return callUid;
            });
        }
        catch(err){
            console.log('Originating Call Error -> ', err);
            return null;
        }
    }

    //bridge Call

    //Call IVR
}