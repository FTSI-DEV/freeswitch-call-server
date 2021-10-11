<template>
  <div>
    <div style="text-align: left; font-size: 1.1em">
      <router-link to="/account/login"> <ArrowLeftOutlined /> Back </router-link>
    </div>
    <div style="padding: 10px">
      <UserAddOutlined style="font-size: 30px; font-weight: 600" />
    </div>
    <a-form :layout="formState.layout" :model="formState" style="margin-top: 15px">
      <a-form-item>
        <a-input
          v-model:value="formState.firstName"
          placeholder="First Name"
          :class="isInvalid(formState.firstName)"
        />
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="formState.lastName"
          placeholder="Last Name"
          :class="isInvalid(formState.lastName)"
        />
      </a-form-item>
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
          type="password"
          :class="isInvalid(formState.password)"
        />
      </a-form-item>
      <a-button type="primary" @click="registerUser" style="width: 100%">Save</a-button>
    </a-form>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, UnwrapRef } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ArrowLeftOutlined, UserAddOutlined } from "@ant-design/icons-vue";
interface FormState {
  layout: "horizontal" | "vertical" | "inline";
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  hasError: boolean;
}
export default defineComponent({
  components: { ArrowLeftOutlined, UserAddOutlined },
  setup() {
    const store = useStore();
    const router = useRouter();
    const formState: UnwrapRef<FormState> = reactive({
      layout: "horizontal",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      hasError: false,
    });
    const isInvalid = (value: string): string =>
      !value && formState.hasError ? "invalid" : "";
    const registerUser = (): void => {
      if (
        !formState.firstName ||
        !formState.lastName ||
        !formState.username ||
        !formState.password
      ) {
        formState.hasError = true;
        return;
      }
      formState.hasError = false;
      const params = {
        FirstName: formState.firstName,
        LastName: formState.lastName,
        Username: formState.username,
        Password: formState.password,
      };
      store.dispatch("registerUser", params).then((res) => {
        if (res.data.Id) {
          router.push({ path: "/account/login" });
        }
      });
    };

    return {
      formState,
      registerUser,
      isInvalid,
    };
  },
});
</script>
<style scoped>
.invalid {
  border: 1px solid red;
}
</style>
