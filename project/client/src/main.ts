import { createApp } from "vue";
import App from "./App.vue";
import AntdvUi from './antdv-components/components'
import store from './store/store';

const app = createApp(App);

AntdvUi(app);

app.use(store);
app.mount("#app");