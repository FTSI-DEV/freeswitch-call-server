import  {createRouter, createMemoryHistory, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import ConfigContainer from "../components/ConfigContainer.vue";

import CallRecording from "../components/callRecording/CallRecording.vue";

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
    }
];

const router = createRouter({
    history,
    routes,
});

export default router;

