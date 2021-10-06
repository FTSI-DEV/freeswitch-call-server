<template>
  <div>
    <div style="padding: 10px; font-weight: 600; font-size: 1.3em">Register</div>
    <a-form :layout="formState.layout" :model="formState" style="margin-top: 20px">
      <a-form-item label="First Name">
        <a-input v-model:value="formState.firstName" placeholder="First Name" />
      </a-form-item>
      <a-form-item label="Last Name">
        <a-input v-model:value="formState.lastName" placeholder="Last Name" />
      </a-form-item>
      <a-form-item label="Username">
        <a-input v-model:value="formState.username" placeholder="Username" />
      </a-form-item>
      <a-form-item label="Password">
        <a-input
          v-model:value="formState.password"
          placeholder="Password"
          type="password"
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
interface FormState {
  layout: "horizontal" | "vertical" | "inline";
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}
export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const formState: UnwrapRef<FormState> = reactive({
      layout: "horizontal",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    });

    const registerUser = (): void => {
      const params = {
        FirstName: formState.firstName,
        LastName: formState.lastName,
        Username: formState.username,
        Password: formState.password,
      };
      console.log("params: ", params);
      store.dispatch("registerUser", params).then((res) => {
        if (res.data.Id) {
          router.push({ path: "/account/login" });
        }
      });
    };

    return {
      formState,
      registerUser,
    };
  },
});
</script>
