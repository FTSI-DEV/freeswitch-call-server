<template>
  <a-layout style="padding: 20px; background: white">
    <div style="text-align: left; font-size: 1.3em">
      <router-link to="/account-config"> <ArrowLeftOutlined /> Back </router-link>
    </div>
    <div class="detail-container">
      <div class="detail_header">
        {{ configItem.accountName }}
        <CheckCircleOutlined
          v-if="configItem.isActive"
          style="color: rgb(87, 204, 153); margin-left: 5px"
          title="Active"
        />
        <CloseOutlined v-else style="color: #ff6358; margin-left: 5px" title="Inactive" />
      </div>
      <div style="margin-top: 20px">
        <a-row>
          <a-col :span="12">
            <a-form-item label="Account Name" style="display: block; text-align: left">
              <input :class="['ant-input']" v-model="configItem.accountName" />
            </a-form-item>
            <a-form-item label="Account SID" style="display: block; text-align: left">
              <span style="font-weight: 600">{{ configItem.accountSID }}</span>
              <!-- <input :class="['ant-input']" v-model="accountSID" /> -->
            </a-form-item>
            <a-form-item label="Auth Token" style="display: block; text-align: left">
              <span style="font-weight: 600"> {{ configItem.authKey }}</span>
              <!-- <input :class="['ant-input']" v-model="authToken" /> -->
            </a-form-item>
            <div style="display: flex; margin-top: 50px">
              <a-button
                type="primary"
                @click="updateAccountConfig(configItem.accountName)"
                >Update</a-button
              >
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </a-layout>
</template>

<script lang="ts">
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, toRefs, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseOutlined,
  },
  setup() {
    const store = useStore();
    const state = reactive({
      accountSID: "",
      authToken: "",
      isActive: true,
      accountName: "",
    });
    const configItem = computed(() => store.getters["getAccountConfigItem"]);
    const updateAccountConfig = (accountName: string) => {
      console.log("accountName", accountName);
      if (!accountName) return;
      const authToken = localStorage.getItem("fs_auth_token");
      store.dispatch("updateAccountConfig", {
        params: { accountName },
        authToken,
      });
    };
    return {
      ...toRefs(state),
      updateAccountConfig,
      configItem,
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
