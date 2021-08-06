import { CONNREFUSED } from "dns";

export class EslServerHelper{

    startEslServer(){
        let esl  = require('modesl');

        let esl_server = new esl.Server({
            port: 5000,
            host: '192.168.18.3',
            myevents: true
        }, function(){
            console.log('esl server is up');
        });

        esl_server.on('connection::ready', function(conn,id){
            
            console.log('CONNECTION SERVER READY');

            conn.execute('bridge', 'sofia/gateway/fs-test3/1000');

            conn.on('esl::end', function(evt,body){
                //insert code here how to handle a call when its end...
            });
            
        });
    }
}