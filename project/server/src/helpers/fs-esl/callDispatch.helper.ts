import { OriginateModel } from "./models/originate.model";

export class CallDispatchHelper{
    
    clickToCall(conn, originateParam: OriginateModel){
        try{
            let app_args = `sofia/gateway${originateParam.gateway1}/${originateParam.extensionGateway1}`;
            let arg1 = `{ignore_early_media=${originateParam.appArgs},origination_caller_id_number=${originateParam.originationNumber},hang_up_after_bridge=true}${app_args}`;
            let arg2 = `${arg1} &bridge(sofia/gateway/${originateParam.gateway2}/${originateParam.extensionGateway2})`;
            
            conn.api('originate', arg2, function(res){
                console.log('Originate', res.getBody());
            })
        }catch(err){
            console.log('Originating Call Error -> ', err);
        }
    }

    //bridge Call

    //Call IVR
}