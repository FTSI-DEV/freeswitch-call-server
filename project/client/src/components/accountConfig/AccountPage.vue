<template>
  <div>
    <a-row>
      <a-col :span="18" style="background: #3db2ff; height: 100vh">
        <div class="center-logo">
          <img src="../../assets//Q-voice-7.png" alt="">
        </div>
      </a-col>
      <a-col :span="6">
        <div style="padding: 20px 15px 15px 15px">
          <router-view></router-view>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped>
  .center-logo {
    width: 640px;
    height: auto;
    margin: 30% auto;
    padding: 10px;
    position: relative;
  }
</style>