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
    constructor(command: string, type:string, attrib: string, value: string, children: any) {

        this.command = command;
        this.type = type;
        this.attrib = JSON.stringify(attrib);
        this.value = value;
        this.children = [];

        for (let i = 0; i < children.length; i++) {
            const element = children[i];
            if (element.name) {
                this.children.push(new CreateCommandObject(element.name, 'exec', element.attr, element.val, element.children));
            }
        }; 

    }  
  }
  
  export class XMLParserContext {
    createCommandObject: CreateCommandObject;
    finalInstructionList: Instructions[] = [];
  }