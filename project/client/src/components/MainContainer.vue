<template>
  <a-layout>
    <a-layout-header
      class="header"
      style="padding-left: 30px; font-size: 2em; display: flex"
    >
      <div class="logo" style="color: #ffb344; text-align: left; flex: 1">
        <cluster-outlined style="margin-right: 15px" />Freeswitch
      </div>
      <div class="user-icon" style="flex: 1; font-size: 0.6em; text-align: right">
        <UserOutlined style="color: #fff; margin-right: 5px" />

        <a-dropdown>
          <a
            class="ant-dropdown-link"
            @click.prevent
            style="color: #fff; font-weight: 600"
          >
            {{ username }}
            <DownOutlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="signOut"> Sign out </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200">
        <a-menu
          theme="dark"
          mode="inline"
          class="menu-style"
          v-model:selectedKeys="selectedKeys2"
          v-model:openKeys="openKeys"
          :style="{ height: '93.5vh !important', borderRight: 0 }"
        >
          <a-menu-item key="1" @click="navigateRoute('/dashboard')">
            <home-filled />
            <span>Home</span>
          </a-menu-item>
          <a-menu-item key="2" @click="navigateRoute('/account-config')">
            <user-outlined />
            <span>Account</span>
          </a-menu-item>
          <a-menu-item key="3" @click="navigateRoute('/call-logs')">
            <read-filled />
            <span>Call Logs</span>
          </a-menu-item>
          <a-menu-item key="4" @click="navigateRoute('/call-recording')">
            <play-circle-filled />
            <span>Call Recording</span>
          </a-menu-item>
          <a-menu-item key="5" @click="navigateRoute('/call-config')">
            <setting-filled />
            <span>Call Config</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '10px',
            minHeight: '280px',
          }"
        >
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import {
  SettingFilled,
  PlayCircleFilled,
  HomeFilled,
  ClusterOutlined,
  ReadFilled,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    SettingFilled,
    PlayCircleFilled,
    HomeFilled,
    ClusterOutlined,
    ReadFilled,
    UserOutlined,
    DownOutlined,
  },
  setup() {
    const store = useStore();
    const username = ref<string>("");
    const router = useRouter();
    let selectedKeys2 = ref<string[]>(["1"]);
    const navigateRoute = (path: string) => {
      router.push({ path });
    };
    navigateRoute("/dashboard");
    if (localStorage.getItem("fs_username")) {
      username.value = localStorage.getItem("fs_username") || "";
    }
    const resetUserInfo = () => {
      localStorage.removeItem("fs_user_key");
      localStorage.removeItem("fs_username");
      localStorage.removeItem("fs_auth_token");
    };
    const signOut = (): void => {
      const authToken = localStorage.getItem("fs_auth_token");
      console.log("signOut: ", authToken);
      store.dispatch("logoutUser", { authToken }).then(() => {
        resetUserInfo();
        navigateRoute("/account/login");
      });
    };
    console.log("Window: ", window);
    window.onhashchange = function () {
      console.log("location: ", window.location);
    };
    watch(router.currentRoute, (val) => {
      if (val.path === "/dashboard") {
        selectedKeys2.value[0] = "1";
      }
    });
    window.addEventListener("popstate", () => {
      signOut();
    });
    return {
      navigateRoute,
      selectedKeys2,
      collapsed: ref<boolean>(false),
      openKeys: ref<string[]>(["sub1"]),
      username,
      signOut,
    };
  },
});
</script>
<style>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
.menu-style {
  height: 100vh;
}
</style>
