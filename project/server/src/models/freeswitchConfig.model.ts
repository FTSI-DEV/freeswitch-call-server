export class FreeswithConfigModel{
    ip: string;
    port: string;
    password: string;

    constructor(ip: string, port: string, password: string){
        this.ip = ip;
        this.port = port;
        this.password = password;
    }
}