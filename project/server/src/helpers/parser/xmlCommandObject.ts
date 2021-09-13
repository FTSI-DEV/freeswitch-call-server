import { isPhoneNumberValid } from '../../utils/phoneNumberValidation';

export interface Instructions {
    command: string;
    type: string;
    attrib: string;
    value: string;
    children: any
  }
  interface XMLParser {
    command: string;
    type: string;
    attrib: object;
    value: string;
    children: any
  }
  
  export class CreateCommandObject {
    command: string;
    type: string;
    attrib: string;
    value: string;
    children: any;
    isNumberValid: boolean;

    constructor(command: string, type:string, attrib: string, value: string, children: any) {

        this.command = command;
        this.type = type;
        this.attrib = JSON.stringify(attrib);
        this.value = value;
        this.children = [];
        this.isNumberValid = true;

        // Parse nested instruction
        if (this.children.length) {
          for (let i = 0; i < children.length; i++) {
            const element = children[i];
            if (element.name) {
              if (element.name === 'Number') {
                this.isNumberValid = isPhoneNumberValid(element.val);
              }
              this.children.push(JSON.stringify(new CreateCommandObject(element.name, 'exec', element.attr, element.val, element.children)));
            }
          }
        }
    }  
  }
  
  export class XMLParserContext {
    createCommandObject: CreateCommandObject;
    finalInstructionList: Instructions[] = [];
  }