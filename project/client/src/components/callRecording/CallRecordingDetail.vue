<template>
  <div class="call-recording-container">
    <div style="text-align: left; font-size: 1.3em">
      <router-link to="/call-recording"> <ArrowLeftOutlined /> Back </router-link>
    </div>
    <div class="detail_container">
      <div class="detail_header">Call Recording Detail</div>
      <a-row style="margin-top: 10px">
        <a-col :span="12">
          <div class="detail_content">
            <div class="detail_item">
              <div class="detail_label">Date Created</div>
              <div class="detail_value">2021-09-19</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Call Id</div>
              <div class="detail_value">Re2fsdfaedas4523asdsdgf</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Recording Id</div>
              <div class="detail_value">Re2fsdfaedas4523asdsdgf</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Recording UUID</div>
              <div class="detail_value">Re2fsdfaedas4523asdsdgf</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Call UUID</div>
              <div class="detail_value">Re2fsdfaedas4523asdsdgf</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">File Path</div>
              <div class="detail_value">/recording</div>
            </div>
          </div>
          <div class="play_record">RECORDING URL HE</div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    ArrowLeftOutlined,
  },
  setup() {
    const router = useRouter();
    const back = (): void => {
      router.push({ path: "/" });
    };
    return {
      back,
    };
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
