import { CommandConstants } from "../constants/freeswitch-command.constants";
import { FreeswitchDpConstants } from "../constants/freeswitchdp.constants";
import { TwiMLContants } from "../constants/twiml.constants";

const xml = require('xmldoc');

export class TwiMLXMLParser{

    tryParse(value:string):DialplanInstruction[]{

        let dpInstructions : DialplanInstruction[] = [];

        try{

            let xmlDocResult = new xml.XmlDocument(value);

            let xmlChildren = xmlDocResult.children;

            for (let i = 0; i < xmlChildren.length; i++){

               let element = xmlChildren[i];

               if (element.name === TwiMLContants.Say){
                   dpInstructions.push({
                       name: FreeswitchDpConstants.speak,
                       command: CommandConstants.exec,
                       value: element.val
                   });
               }
               else if (element.name === TwiMLContants.Gather){
                   dpInstructions.push({
                       name: FreeswitchDpConstants.play_and_get_digits,
                       command: CommandConstants.exec,
                       value: element.val,
                       gatherAttribute : {
                           numDigits: element.attr.numDigits,
                           action: element.attr.action,
                           method: element.attr.method,
                           timeout: element.attr.timeout
                       }
                   });
               }
               else if (element.name === TwiMLContants.Redirect){
                   dpInstructions.push({
                       name: "",
                       command: CommandConstants.axios,
                       value: element.val
                   });
               }
               else if (element.name === TwiMLContants.Play){
                   dpInstructions.push({
                       name: FreeswitchDpConstants.playback,
                       command : CommandConstants.exec,
                       value: element.val
                   });
               }
               else if (element.name === TwiMLContants.Dial){
                
                    let dpInstruction : DialplanInstruction = {
                        command: CommandConstants.exec,
                        name: FreeswitchDpConstants.bridge,
                        value: element.val,
                        dialAttribute : {
                            action: element.attr.action,
                            method: element.attr.method,
                            callerId: element.attr.callerId,
                            recordCondition: element.attr.record
                        }
                    };

                    let child = element.descendantWithPath(TwiMLContants.Number);

                    dpInstruction.children = {
                        command: "",
                        value: child.val,
                        name: child.name
                    };

                    dpInstructions.push(dpInstruction);
               }
               else if (element.name === TwiMLContants.Reject){
                   dpInstructions.push({
                       name: FreeswitchDpConstants.hangup,
                       command: CommandConstants.exec,
                       value : ""
                   });
               }
            }
        }
        catch(err){
            console.log('ERROR PARSING TWIML -> ',err);
        }

        return dpInstructions;
    }
}

export interface DialplanInstruction {
    name: string; //mod_dpTools
    command: string; //command used to be executed
    dialAttribute?: DialAttribute;
    gatherAttribute?: GatherAttribute;
    value: string;
    children?: DialplanInstruction;
    order?:number;
  }
  
  export interface GatherAttribute {
    numDigits: string;
    action: string;
    method: string;
    timeout: string;
  }
  
  export interface DialAttribute {
    action: string; //webhook
    method: string; //http method
    callerId: string;
    recordCondition: string;
  }