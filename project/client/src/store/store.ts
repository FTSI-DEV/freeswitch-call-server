import { createStore } from 'vuex';
import InboundCallConfig from './inboundCallConfig/inboundCallConfig';
import PhoneNumberConfig from './phoneNumberConfig/phoneNumberConfig';
import ClickToCall from './clickToCall/clickToCall';

export default createStore({
    modules: {
        InboundCallConfig, 
        PhoneNumberConfig,
        ClickToCall
    }
});