import { TwiMLContants } from '../constants/twiml.constants';
import { XMLParserContext, CreateCommandObject } from './XMLCommandObject';
import { isPhoneNumberValid } from '../../utils/phoneNumberValidation';

const xmldoc = require('xmldoc');

export interface KeyValues {
  key: string;
  value: any;
}

export class XMLParser {

  tryParseXMLBody(xmlText: string):KeyValues[] {

    let keyValues: KeyValues[] = [];

    let xmlDocResult = new xmldoc.XmlDocument(xmlText);

    xmlDocResult.children.forEach((element) => {
      var newKeyValue = <KeyValues>{};

      newKeyValue.key = element.name;
      newKeyValue.value = element.val;

      if (element.name === TwiMLContants.Say) {
        keyValues.push(newKeyValue);
      } else if (element.name === TwiMLContants.Hangup) {
        keyValues.push(newKeyValue);
      } else if (element.name === TwiMLContants.Dial) {
        keyValues.push(newKeyValue);
      } else if (element.name === TwiMLContants.Gather) {
        keyValues.push(newKeyValue);
      }
    });

    console.log('KEY VALUES -> ', keyValues);
    
    return keyValues;
  }
}

export class XMLParserHelper {
  tryParseXMLBody(xmlText): XMLParserContext {

    let context = new XMLParserContext();

    const xmlDocResult = new xmldoc.XmlDocument(xmlText);

    const xmlChildren = xmlDocResult.children;

    for (let i = 0; i < xmlChildren.length; i++) { 
      const element = xmlChildren[i];
      if (element.name === TwiMLContants.Say) {
        context.finalInstructionList.push(context.createCommandObject = new CreateCommandObject(element.name, 'exec', element.attr, element.val, element.children));
      } else if (element.name  === TwiMLContants.Dial) {
        if (isPhoneNumberValid(element.val)){
          context.finalInstructionList.push(context.createCommandObject = new CreateCommandObject(element.name, 'exec', element.attr, element.val, element.children));
        }
      } else if (element.name ===  TwiMLContants.Reject) {
        context.finalInstructionList.push(context.createCommandObject = new CreateCommandObject(element.name, 'exec', element.attr, element.val, element.children));
      } else if (element.name === TwiMLContants.Pause) {
        context.finalInstructionList.push(context.createCommandObject = new CreateCommandObject(element.name, 'exec', element.attr, element.val, element.children));
      } else if (element.name === TwiMLContants.Gather) {
        context.finalInstructionList.push(context.createCommandObject = new CreateCommandObject(element.name, 'exec', element.attr, element.val, element.children));
      }
    }
    return context;
  }
}
// class XMLParserContextObject{
//   arrayConExecute = [key,value,order],
//   arrayConApi = [key,value]
// }
