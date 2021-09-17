import { createStore } from 'vuex';
import InboundCallConfig from './inboundCallConfig/inboundCallConfig';
import PhoneNumberConfig from './phoneNumberConfig/phoneNumberConfig';
import ClickToCall from './clickToCall/clickToCall';
import CallRecording from './callRecording/callRecording';
import CallDetailRecords from './callDetailRecords/callDetailRecords';

export default createStore({
    modules: {
        InboundCallConfig, 
        PhoneNumberConfig,
        ClickToCall,
        CallRecording,
        CallDetailRecords
    }
});