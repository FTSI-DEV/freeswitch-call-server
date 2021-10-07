<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import MainContainer from "./components/MainContainer.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "App",
  components: {
    // MainContainer,
  },
  setup() {
    const router = useRouter();
    const fsUserKey = localStorage.getItem("fs_user_key");
    if (fsUserKey) {
      // Redirect to dashboard if user alredy logged in
      router.push({ path: "/" });
    } else {
      router.push({ path: "/account/login" });
    }
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
