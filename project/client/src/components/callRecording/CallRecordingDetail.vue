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
              <div class="detail_value">
                {{ convertDateTime(callRecordingData.DateCreated) }}
              </div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Recording Id</div>
              <div class="detail_value">
                {{ callRecordingData.RecordingId }}
              </div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Recording UUID</div>
              <div class="detail_value">
                {{ callRecordingData.RecordingUUID }}
              </div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Call UUID</div>
              <div class="detail_value">{{ callRecordingData.CallUUID }}</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">File Path</div>
              <div class="detail_value">{{ callRecordingData.FilePath }}</div>
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
import { defineComponent, computed } from "vue";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import { useStore } from "vuex";
import moment, { Moment } from "moment";
const dateTimeConverter: Moment = moment();
export default defineComponent({
  components: {
    ArrowLeftOutlined,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const back = (): void => {
      router.push({ path: "/" });
    };
    const convertDateTime = (dateTime: string): string => {
      return moment(dateTime).format("MM/DD/YYYY hh:mm A");
    };
    const callRecordingData = computed(() => store.getters["getCallRecordingDetail"]);
    return {
      back,
      callRecordingData,
      convertDateTime,
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
