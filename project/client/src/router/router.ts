import  {createRouter, createMemoryHistory, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import ConfigContainer from "../components/ConfigContainer.vue";
import CallRecording from "../components/callRecording/CallRecording.vue";
import CallRecordingDetail from "../components/callRecording/CallRecordingDetail.vue";
import CallLogs from "../components/callDetailRecords/CallDetailRecords.vue";
import CallLogsDetail from "../components/callDetailRecords/CallLogsDetail.vue";
const isServer = typeof window === 'undefined';

const history = isServer ? createMemoryHistory() : createWebHistory();

const routes: Array<any> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: "/call-config",
        name: "Call Config",
        component: ConfigContainer,
    },
    {
        path: "/call-recording",
        name: "Call Recording",
        component: CallRecording,
    },
    {
        path: "/call-recording/details",
        name: "Call Recording Details",
        component: CallRecordingDetail,
    },
    {
        path: "/call-logs",
        name: "Call Logs",
        component: CallLogs,
    },
    {
        path: "/call-logs/details",
        name: "Call Logs Detail",
        component: CallLogsDetail,
    }
];

const router = createRouter({
    history,
    routes,
});

export default router;

