import { TwiMLContants } from '../constants/twiml.constants';

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
