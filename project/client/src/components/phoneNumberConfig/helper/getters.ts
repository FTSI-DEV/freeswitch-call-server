import { computed } from 'vue';
import { useStore } from 'vuex';
import { PhoneNumberConfigItem } from '../../../types/phoneNumberConfig';

export default function gettersObj() {
    const store = useStore();
    
    const phoneNumberConfigList = computed((): Array<PhoneNumberConfigItem> => store.getters['getPhoneNumberConfig']);
    const phoneNumberConfig = computed((): PhoneNumberConfigItem => store.getters['getPhoneNumberConfigById']);

    return {
        phoneNumberConfigList,
        phoneNumberConfig
    }
} 