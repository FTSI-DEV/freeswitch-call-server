const readline = require("readline");
const xml = require('xmldoc');

export const start = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

start.question("Enter value ", function saveInput(name) {
  console.log(`VALUE ENTERED \n ${name}`);

  new XmlParserSample().tryParse(name);
});

interface DialplanInstructions{
    dp:string;
    type:string;
    attrib?:GatherAttribute;
    value:string;
    children?:any;
}

interface GatherAttribute{
    numDigits: string;
    action:string;
    method:string;
    timeout:string;
}


export class XmlParserSample{

    tryParse(value:string):DialplanInstructions[]{

        let arrValue : string[] = [];

        let dpInstructions : DialplanInstructions[] = [];

        let xmlDocResult = new xml.XmlDocument(value);

        let xmlChildren = xmlDocResult.children;

        for (let i = 0; i < xmlChildren.length; i++){

            let element = xmlChildren[i];

            if (element.name === "Say"){

                arrValue.push(element.name);

                dpInstructions.push({
                    dp: "say",
                    type: "exec",
                    value: element.val,
                    attrib: element.attr,
                    children : element.children
                });
            }
            else if (element.name === "Gather"){

                arrValue.push(element.name);

                dpInstructions.push({
                    dp: "play_and_get_digits",
                    type: "exec",
                    value: element.val,
                    attrib: {
                        numDigits: element.attr.numDigits,
                        action: element.attr.action,
                        method: element.attr.method,
                        timeout: element.attr.timeout
                    },
                    children : element.children
                });
            }
        }

        return dpInstructions;
    }
}