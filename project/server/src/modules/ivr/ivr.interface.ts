export const IVR_SERVICE = 'IVR SERVICE';

export interface IIVRService{
    greet(name:string):Promise<string>;
}