import { ContextIdFactory } from "@nestjs/core";
import axios from "axios";
import { CHANNEL_VARIABLE } from "src/helpers/constants/channel-variables.constants";
import { CustomAppLogger } from "src/logger/customLogger";
import { http } from "winston";
import { InboundEslConnResult } from "../inbound-esl.connection";
import { ChannelStateModel, OutboundCallContext } from "./models/outboundCallContext";
import redis from 'redis';
import { DialplanInstruction, TwiMLXMLParser } from "src/helpers/parser/xmlParser";
import { CommandConstants } from "src/helpers/constants/freeswitch-command.constants";
import { FreeswitchDpConstants } from "src/helpers/constants/freeswitchdp.constants";
import { connect } from "http2";
import { PlayAndGetDigitsParam } from "../inbound-call/models/plagdParam";
import { TimeConversion } from "src/utils/timeConversion.utils";
import { DialVerify } from "./handlers/dialVerify";
import { CallRejectedHandler } from "./handlers/callRejectedHandler";

export class OutboundCallHelper{

    private readonly _logger = new CustomAppLogger(OutboundCallHelper.name);
    private readonly _inboundEslConn = InboundEslConnResult;

    constructor(
        private _context: OutboundCallContext,
        private _callRejectedHandler = new CallRejectedHandler(_context)
    ){}

    outboundCallEnter(){

        let server = this._context.server;

        let context = this._context;

        server.on('connection::ready', (conn) => {

            console.log('OutboundCall Server ready');

            context.connection = conn;
            
            let legId = conn
                .getInfo()
                .getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

            let channelStateModel: ChannelStateModel = {
                legId : legId,
                channelState : conn.getInfo().getHeader('Channel-State'),
                answerState: conn.getInfo().getHeader('Answer-State')
            };

            context.redisServer.set(context.redisServerName, JSON.stringify(channelStateModel), (err,reply) => {
                console.log('Redis State Saved! -> ', reply);
            });

            context.redisServer.get(context.redisServerName, (err,reply) => {
                console.log('Retrieve from REDIS ! -> ', reply);
            });

            if (channelStateModel.answerState === 'hangup'){
                return;
            }

            let phoneNumberFrom = conn
                .getInfo()
                .getHeader(CHANNEL_VARIABLE.CALLER_CALLE_ID_NUMBER);

            conn.on('error', (err) => {
                console.log('Error -> ', err);
            });

            context.requestParam.From = phoneNumberFrom;

            context.serviceModel.callDetailRecordSrvc
                .getByCallUid(legId)
                .then((result) => {

                if (result === undefined){
                    console.log('error -> leg must stop.');
                    this._context.legStop = true;
                    this._context.callRejected = true;
                    this._callRejectedHandler.reject(this._context, () => {});
                    return;
                }

                new DialVerify(this._context).dialVerify();

            })
            .catch((error) => {
                console.log('Error -> ', error);
                this._context.legStop = true;
                this._context.callRejected = true;
                this._callRejectedHandler.reject(this._context, () => {});
                return;

            });
        });
    }
}