<template>
  <a-layout style="padding: 20px; background: white">
    <div style="text-align: left; font-size: 1.3em">
      <router-link to="/account-config"> <ArrowLeftOutlined /> Back </router-link>
    </div>
    <div class="detail-container">
      <div class="detail_header">Add Account Config</div>
      <div style="margin-top: 20px">
        <a-row>
          <a-col :span="12">
            <a-form-item label="Account Name" style="display: block; text-align: left">
              <input :class="['ant-input']" v-model="accountName" />
            </a-form-item>
            <!-- <a-form-item label="Account SID" style="display: block; text-align: left">
              <input :class="['ant-input']" v-model="accountSID" />
            </a-form-item>
            <a-form-item label="Auth Token" style="display: block; text-align: left">
              <input :class="['ant-input']" v-model="authToken" />
            </a-form-item>
            <div style="display: flex">
              <span>Active</span>
              <a-checkbox
                v-model:checked="isActive"
                style="margin-left: 10px !important"
              />
            </div> -->
            <div style="display: flex; margin-top: 50px">
              <a-button type="primary" @click="saveAccountConfig">Save</a-button>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </a-layout>
</template>

<script lang="ts">
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import { defineComponent, toRefs, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    ArrowLeftOutlined,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      accountName: "",
      accountSID: "",
      authToken: "",
      isActive: true,
    });

    const saveAccountConfig = () => {
      if (!state.accountName) return;
      const authToken = localStorage.getItem("fs_auth_token");
      store
        .dispatch("addAccountConfig", {
          accountName: state.accountName,
          authToken,
        })
        .then((res) => {
          if (res.data.Status === 1) {
            router.push({ path: "/account-config" });
          }
        });
      console.log("saveAccountConfig");
    };

    return {
      ...toRefs(state),
      saveAccountConfig,
    };
  },
});
</script>

<style scoped>
.detail_header {
  padding: 10px 10px 5px 0px;
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
