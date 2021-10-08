import { createRouter, createMemoryHistory, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import ConfigContainer from "@/components/ConfigContainer.vue";
import CallRecording from "@/components/callRecording/CallRecording.vue";
import CallRecordingDetail from "@/components/callRecording/CallRecordingDetail.vue";
import CallLogs from "@/components/callDetailRecords/CallDetailRecords.vue";
import CallLogsDetail from "@/components/callDetailRecords/CallLogsDetail.vue";
import AccountConfig from "@/components/accountConfig/AccountConfig.vue";
import AccountConfigDetail from "@/components/accountConfig/AccountConfigDetail.vue";
import AccountConfigAdd from "@/components/accountConfig/AccountConfigAdd.vue";
import AccountPage from "@/components/accountConfig/AccountPage.vue";
import AccountLogin from "@/components/accountConfig/AccountLogin.vue";
import AccountRegister from "@/components/accountConfig/AccountRegister.vue";
import MainContainer from "@/components/MainContainer.vue";
import Dashboard from "@/components/Home.vue";
const isServer = typeof window === 'undefined';

const history = isServer ? createMemoryHistory() : createWebHistory();

const routes: Array<any> = [
    {
        path: "/account/login",
        name: "Login",
        component: AccountPage,
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                path: '/account/login',
                name: 'User Login',
                component: AccountLogin
            },
            {
                path: '/account/register',
                name: 'User Register',
                component: AccountRegister
            }
        ]
    },
    {
        path: '/',
        name: 'MainContainer',
        component: MainContainer,
        children: [
            {
                path: "/dashboard",
                name: "Dashboard",
                component: Dashboard,
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
                meta: {
                    requiresAuth: true,
                },
            },
            {
                path: "/call-recording/details",
                name: "Call Recording Details",
                component: CallRecordingDetail,
                meta: {
                    requiresAuth: true,
                },
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
            },
            {
                path: "/account-config",
                name: "Account Config",
                component: AccountConfig,
            },
            {
                path: "/account-config/details",
                name: "Account Config Detail",
                component: AccountConfigDetail,
            },
            {
                path: "/account-config/add",
                name: "Add Account Config",
                component: AccountConfigAdd,
            }
        ]
    }
];

const router = createRouter({
    history,
    routes,
});

// router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//         if (!localStorage.getItem('fs_auth_token')) {
//             next("/");
//         } else {
//             next();
//         }
//     } else { next() }
// });

export default router;

