export class FreeswithConfigModel{
    ip: string;
    port: number;
    password: string;

    constructor(ip: string, port: number, password: string){
        this.ip = ip;
        this.port = port;
        this.password = password;
    }
}