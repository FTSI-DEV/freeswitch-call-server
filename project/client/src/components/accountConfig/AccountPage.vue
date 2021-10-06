<template>
  <div>
    <a-row>
      <a-col :span="18" style="background: #001529; height: 100vh">
        <div>
          <LoginCoverImage />
          <!-- <cluster-outlined style="margin-right: 20px" />Freeswitch -->
        </div>
      </a-col>
      <a-col :span="6">
        <div style="padding: 50px 15px 15px 15px">
          <router-view></router-view>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
// import { ClusterOutlined } from "@ant-design/icons-vue";
import LoginCoverImage from "./LoginCoverImage.vue";
export default {
  components: { LoginCoverImage },
};
</script>

<style scoped>
.icon-container {
  color: #ffb344;
  width: 640px; /* Can be in percentage also. */
  height: auto;
  margin: 20% auto;
  padding: 10px;
  position: relative;
  font-size: 4em;
}
</style>
