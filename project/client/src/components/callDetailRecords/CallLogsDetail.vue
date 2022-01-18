<template>
  <div>
    <a-page-header :style="{
        background: '#fff',
        padding: '0px 10px 10px 10px',
        textAlign: 'left',
        marginBottom: '5px'
    }" @back="() => null">
      <router-link to="/call-logs">
        <ArrowLeftOutlined /> Back
      </router-link>
    </a-page-header>
    <a-layout style="padding: 20px; background: white">
      <a-row>
        <a-col :span="12">
          <div class="detail_content">
            <div class="detail_item">
              <div class="detail_label">Call UUID</div>
              <div class="detail_value">{{ callRecordDetail.CallUUID }}</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Parent Call Uid</div>
              <div class="detail_value">{{ callRecordDetail.ParentCallUid }}</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Call Direction</div>
              <div class="detail_value">{{ callRecordDetail.CallDirection }}</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Call Status</div>
              <div class="detail_value">{{ callRecordDetail.CallStatus }}</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Duration</div>
              <div class="detail_value">{{ callRecordDetail.Duration }}</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Date Created</div>
              <div class="detail_value"> {{ convertDateTime(callRecordDetail.DateCreated) }} </div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Phone Number From</div>
              <div class="detail_value">{{ callRecordDetail.PhoneNumberFrom }}</div>
            </div>
            <div class="detail_item">
              <div class="detail_label">Phone Number To</div>
              <div class="detail_value">{{ callRecordDetail.PhoneNumberTo }}</div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-layout>
  </div>
</template>
<script lang="ts">
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
      const callRecordDetail = computed(() => store.getters["getCallDetail"]);
      const convertDateTime = (dateTime: string): string => {
        return moment(dateTime).format("MM/DD/YYYY hh:mm A");
      };
      return {
        callRecordDetail,
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