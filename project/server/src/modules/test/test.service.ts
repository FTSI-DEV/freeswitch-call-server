import { Injectable } from "@nestjs/common";
import { FreeswitchConnectionResult } from "src/helpers/fs-esl/eslfreeswitch.connection";

@Injectable()
export class TestService {

    async triggerSofiaStatus():Promise<string>{

        return new Promise<string>((resolve,reject) => {
            let connectionResult = FreeswitchConnectionResult;

            if (!connectionResult.isSuccess){
    
                console.log('Connection Error -> No ESL Connection established');
                return "Connection Error -> No ESL Connection established";
            }
    
            let connection = connectionResult.connectionObj;
    
            connection.api('sofia status', function(res){
                let result = res.getBody().toString().replace('+OK ', '');
                console.log('result' , result);
                resolve(result.trim());
            });
        });
       
    }
}