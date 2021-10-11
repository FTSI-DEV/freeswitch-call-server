import axios from "axios";

export class WebhookUrlHelper{

    async triggerWebhook(url:string,method:string,params:any,callback:callbackType){

        var webhookResult = new WebhookResult();

        let record = null;

        console.log('webhook params -> '  , params);

        try
        {
            if (method === 'POST')
                record = await axios.post(url, params);
            else
                record = await axios.get(url, { params : params } );

            webhookResult.Data = record.data;

            console.log('Webhook data -> ', webhookResult.Data);

            callback(webhookResult);
        }
        catch(err){

            webhookResult.Error = true;

            webhookResult.ErrorMessage = err;

            console.log('Webhook err -> ', err);

            callback(webhookResult);
        }
    }

    
}

export class WebhookResult{
    Data: any;
    Error: boolean=false;
    ErrorMessage: string;
}

export interface callbackType { (args: WebhookResult) : void }