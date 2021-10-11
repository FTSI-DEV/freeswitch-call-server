<template>
  <a-layout style="padding: 10px; background: #fff">
    <div class="call-config">
      <div style="text-align: left; flex: 1">Call Recording</div>
    </div>
    <a-list item-layout="horizontal" :data-source="recordingsData">
      <template #renderItem="{ item }">
        <a-list-item style="text-align: left; padding: 0">
          <a-list-item-meta>
            <template #description>
              <div class="item-container">
                <div>
                  <div class="d-flex">
                    <span style="margin-right: 15px">Date Created</span>
                    <h5 style="font-size: 1em">{{ item.DateCreated }}</h5>
                  </div>
                  <div class="d-flex">
                    <span style="margin-right: 15px">Duration</span>
                    <h5 style="font-size: 1em">{{ item.Duration }}</h5>
                  </div>
                  <div class="d-flex">
                    <span style="margin-right: 15px">Recording UUID</span>
                    <h5 style="font-size: 1em">{{ item.RecordingUUID }}</h5>
                  </div>
                </div>
                <div style="text-align: right; margin-top: 20px">
                  <MenuFoldOutlined
                    @click="viewDetails"
                    class="view_icon"
                    title="View Details"
                  />
                  <DeleteFilled
                    @click="deleteRecording(item)"
                    class="view_icon"
                    style="color: #f86c6b"
                    title="Delete Recording"
                  />
                </div>
              </div>
            </template>
            <!-- <template #title>
              <a href="https://www.antdv.com/">{{ item.DateCreated }}</a>
            </template> -->
            <template #avatar>
              <PhoneFilled style="font-size: 2em; line-height: 3; color: #3d56b2" />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { CallRecordingItem } from "../../types/callRecording";
import { MenuFoldOutlined, PhoneFilled, DeleteFilled } from "@ant-design/icons-vue";

export default defineComponent({
  components: { MenuFoldOutlined, PhoneFilled, DeleteFilled },
  setup() {
    const authToken = localStorage.getItem("fs_auth_token");
    const store = useStore();
    const router = useRouter();
    const recordingsData = computed(
      (): CallRecordingItem[] => store.getters["getCallRecordings"]
    );
    const getRecordings = (): void => {
      store.dispatch("getCallRecordings", { params: { page: 1, limit: 10 }, authToken }).catch((err) => {
        console.log(err);
        router.push("/dashboard");
      });
    };
    getRecordings();
    const viewDetails = (): void => {
      router.push({ path: "/call-recording/details" });
    };
    const deleteRecording = (item: CallRecordingItem): void => {
      if (confirm("Do you want to delete this recording?")) {
        console.log(item);
        //store.dispatch("deleteCallRecording", { recordingId: item.RecordingId });
      }
    };
    return {
      recordingsData,
      getRecordings,
      viewDetails,
      deleteRecording,
    };
  },
});
</script>

<style scoped>
.call-config {
  display: flex;
  font-size: 1.5em;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20px;
}
.d-flex {
  display: flex;
}
.item-container {
  display: grid;
  grid-auto-flow: column;
}
.view_icon {
  font-size: 1.4em;
  line-height: 3;
  color: #3d56b2;
  margin-right: 30px;
}
.view_icon:hover {
  transform: scale(1.5);
}
</style>
