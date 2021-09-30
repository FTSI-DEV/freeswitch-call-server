<template>
  <div class="call-recording-container">
    <div style="text-align: left; font-size: 1.3em">
      <router-link to="/call-logs"> <ArrowLeftOutlined /> Back </router-link>
    </div>
    <div class="detail_container">
      <div class="detail_header">Call Log Detail</div>
      <a-row style="margin-top: 10px">
        <a-col :span="12">
          <div class="detail_content">
            <div class="detail_item">
              <div class="detail_label">Call UUID</div>
              <div class="detail_value">1BAER34Aase2aba</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Parent Call Uid</div>
              <div class="detail_value">1BAER34Aase2aba</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Call Direction</div>
              <div class="detail_value">1BAER34Aase2aba</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Call Status</div>
              <div class="detail_value">1BAER34Aase2aba</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Duration</div>
              <div class="detail_value">1BAER34Aase2aba</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Date Created</div>
              <div class="detail_value">1BAER34Aase2aba</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Phone Number From</div>
              <div class="detail_value">1BAER34Aase2aba</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Phone Number To</div>
              <div class="detail_value">1BAER34Aase2aba</div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    ArrowLeftOutlined,
  },
});
</script>

<style scoped>
.detail_header {
  padding: 10px;
  text-align: left;
  font-size: 1.5em;
  border-bottom: 1px solid #c8c8c8;
}
.detail_item {
  display: flex;
}
.detail_label {
  text-align: left;
  font-weight: 600;
  width: 200px;
  padding: 10px;
}
.detail_value {
  flex: 1;
  text-align: left;
  padding: 10px;
}
</style>
