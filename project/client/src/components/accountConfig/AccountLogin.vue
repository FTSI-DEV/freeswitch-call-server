<template>
  <div>
    <div style="padding: 10px">
      <UserOutlined style="font-size: 30px; font-weight: 600" />
    </div>
    <a-form :layout="formState.layout" :model="formState" style="margin-top: 15px">
      <a-form-item>
        <a-input
          v-model:value="formState.username"
          placeholder="Username"
          :class="isInvalid(formState.username)"
        />
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="formState.password"
          placeholder="Password"
          :class="isInvalid(formState.password)"
          type="password"
        />
      </a-form-item>
      <div>
        <a-button style="width: 100%" type="primary" @click="loginUser">Login</a-button>
        <div style="display: flex; margin: 10px 0px 10px 0px">
          <div class="left-line"></div>
          <div style="width: 40px">or</div>
          <div class="right-line"></div>
        </div>
        <router-link to="/account/register" style="margin-top: 10px">
          <a-button style="width: 100%">Register</a-button>
        </router-link>
      </div>
    </a-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, UnwrapRef } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { UserOutlined } from "@ant-design/icons-vue";
interface FormState {
  layout: "horizontal" | "vertical" | "inline";
  username: string;
  password: string;
  hasError: boolean;
}
export default defineComponent({
  components: { UserOutlined },
  setup() {
    const store = useStore();
    const router = useRouter();
    const formState: UnwrapRef<FormState> = reactive({
      layout: "horizontal",
      username: "",
      password: "",
      hasError: false,
    });
    const isInvalid = (value: string): string =>
      !value && formState.hasError ? "invalid" : "";
    const loginUser = () => {
      if (!formState.username || !formState.password) {
        formState.hasError = true;
        return;
      }
      formState.hasError = false;
      const params = {
        Username: formState.username,
        Password: formState.password,
      };
      console.log("params: ", params);
      store.dispatch("loginUser", params).then((res) => {
        if (res.data.Id) {
          console.log("res: ", res);
          console.log("res.data: ", res.data);
          localStorage.setItem("fs_user_key", `${res.data.Id}${new Date().getTime()}`);
          localStorage.setItem("fs_username", res.data.Username);
          localStorage.setItem("fs_auth_token", res.headers.authorization);
          router.push({ path: "/" });
        }
      });
    };
    return {
      formState,
      loginUser,
      isInvalid,
    };
  },
});
</script>

<style scoped>
.left-line {
  flex: 1;
  border-bottom: 1px solid #cecece;
  height: 13px;
}
.right-line {
  flex: 1;
  border-bottom: 1px solid #cecece;
  height: 13px;
}
.invalid {
  border: 1px solid red;
}
</style>
