import { computed } from 'vue';
import { useStore } from 'vuex';
import { InboundConfigItem } from '../../../types/InbounCallConfig';

export default function gettersObj() {
    const store = useStore();

    const inboundCallConfigData = computed((): Array<InboundConfigItem> => store.getters['inboundCallConfigData']);
    const inboundCallConfigById = computed((): InboundConfigItem => store.getters['inboundConfigById']);

    return {
        inboundCallConfigData,
        inboundCallConfigById
    }
}