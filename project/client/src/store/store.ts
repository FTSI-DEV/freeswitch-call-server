import { createStore } from 'vuex';
import InboundCallConfig from './inboundCallConfig/inboundCallConfig';
import PhoneNumberConfig from './phoneNumberConfig/phoneNumberConfig';
import ClickToCall from './clickToCall/clickToCall';
import CallRecording from './callRecording/callRecording';
import CallDetailRecords from './callDetailRecords/callDetailRecords';
import IVRConfig from './ivr/ivrConfig';
import AccountConfig from './accountConfig/accountConfig';
import Auth from './auth/auth';

export default createStore({
    modules: {
        InboundCallConfig, 
        PhoneNumberConfig,
        ClickToCall,
        CallRecording,
        CallDetailRecords,
        IVRConfig,
        AccountConfig,
        Auth
    }
});