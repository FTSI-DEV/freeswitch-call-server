<template>
  <MainContainer />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MainContainer from "./components/MainContainer.vue";

export default defineComponent({
  name: "App",
  components: {
    MainContainer,
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
