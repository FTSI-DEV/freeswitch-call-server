import axios from 'axios';
import apiClient from 'src/utils/apiClient';
import { XMLParser } from '../parser/twimlXML.parser';

export class EslServerHelper {
  //for InboundCall
  startEslServer() {
    let esl = require('modesl');

    let esl_server = new esl.Server(
      {
        port: 5000,
        host: '192.168.18.3',
        myevents: true,
      },
      function () {
        console.log('esl server is up');
      },
    );

    esl_server.on('connection::ready', function (conn, id) {
      console.log('CONNECTION SERVER READY');

      //return this a promise
      apiClient
        .getIncomingCallVerify({
          StoreId: 60,
          SystemId: 1,
        })
        .then((res) => {
          //semantic-processor
          var xmlParser = new XMLParser().tryParseXMLBody(res.data);
        })
        .catch((err) => console.log(err));

      //create pre-processor ,parser

      conn.execute('bridge', 'sofia/gateway/fs-test3/1000');

      conn.on('esl::end', function (evt, body) {
        //insert code here how to handle a call when its end...
      });
    });
  }
}
