import { createApp } from "vue";
import App from "./App.vue";
import AntdvUi from './antdv-components/components'

const app = createApp(App);

AntdvUi(app);

app.mount("#app");