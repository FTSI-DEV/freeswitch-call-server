<template>
  <a-layout style="padding: 20px; background: white">
    <div style="text-align: left; font-size: 1.3em">
      <router-link to="/account-config"> <ArrowLeftOutlined /> Back </router-link>
    </div>
    <div class="detail-container">
      <div class="detail_header">
        <div style="flex: 1">
          {{ configItem.accountName }}
          <CheckCircleOutlined
            v-if="configItem.isActive"
            style="color: rgb(87, 204, 153); margin-left: 5px"
            title="Active"
          />
          <CloseOutlined
            v-else
            style="color: #ff6358; margin-left: 5px"
            title="Inactive"
          />
        </div>
        <div style="flex: 1; text-align: right; line-height: 2; font-size: 0.8em">
          <CalendarOutlined style="margin-right: 5px" title="Date Created" />{{
            convertDateTime(configItem.dateCreated)
          }}
        </div>
      </div>
      <div style="margin-top: 20px">
        <a-row>
          <a-col :span="12">
            <a-form-item label="Account Name" style="display: block; text-align: left">
              <input :class="['ant-input']" v-model="configItem.accountName" />
            </a-form-item>
            <a-form-item label="Account SID" class="form-field">
              <div class="form-value">
                <div style="flex: 1; text-align: left">
                  {{ configItem.accountSID }}
                </div>
                <div style="width: 20px text-align: right">
                  <a-tooltip placement="left" title="Copied" trigger="click">
                    <CopyOutlined
                      style="cursor: pointer"
                      @click="copyString(configItem.accountSID)"
                    />
                  </a-tooltip>
                </div>
              </div>
              <!-- <input :class="['ant-input']" v-model="accountSID" /> -->
            </a-form-item>
            <a-form-item label="Auth Token" class="form-field">
              <div class="form-value">
                <div style="flex: 1; text-align: left">
                  <span v-if="isShow" @mouseout="isShow = false">{{
                    configItem.authKey
                  }}</span>
                  <span v-else @mouseover="isShow = true">Show</span>
                </div>
                <div style="width: 20px text-align: right">
                  <a-tooltip placement="left" title="Copied" trigger="click">
                    <CopyOutlined
                      style="cursor: pointer"
                      @click="copyString(configItem.authKey)"
                    />
                  </a-tooltip>
                </div>
              </div>
              <!-- <input :class="['ant-input']" v-model="authToken" /> -->
            </a-form-item>
            <div style="display: flex; margin-top: 50px">
              <a-button type="primary" @click="updateAccountConfig(configItem)"
                >Update</a-button
              >
            </div>
          </a-col>
          <a-col :span="12" style="text-align: right">
            <a-button type="primary" danger @click="deactivateAccount(configItem)"
              >Deactivate</a-button
            >
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
  CalendarOutlined,
  CopyOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, toRefs, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import moment, { Moment } from "moment";
import { useRouter } from "vue-router";
const dateTimeConverter: Moment = moment();

export default defineComponent({
  components: {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseOutlined,
    CalendarOutlined,
    CopyOutlined,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      accountSID: "",
      authToken: "",
      isActive: true,
      accountName: "",
      isShow: false,
    });
    const configItem = computed(() => store.getters["getAccountConfigItem"]);
    const updateAccountConfig = (item: any) => {
      if (!item.accountName) return;
      const authToken = localStorage.getItem("fs_auth_token");
      store.dispatch("updateAccountConfig", {
        params: { accountName: item.accountName, id: item.id },
        authToken,
      });
    };
    const convertDateTime = (dateTime: string): string => {
      return moment(dateTime).format("MM/DD/YYYY hh:mm A");
    };
    const deactivateAccount = (item: any): void => {
      const authToken = localStorage.getItem("fs_auth_token");
      store
        .dispatch("deleteAccountConfig", { params: { id: item.id }, authToken })
        .then((res) => {
          if (res.data.Status === 1) {
            store
              .dispatch("getAccountConfigById", {
                id: item.id,
                authToken,
              })
              .then((res) => {
                if (res.data.Status === 1) {
                  store.dispatch("setAccountConfigData", res.data.Data);
                  router.push({ path: "/account-config" });
                }
              });
          }
        });
    };
    const copyString = (text: string): void => {
      const clipboard = navigator.clipboard;

      clipboard.writeText(text);
    };
    return {
      ...toRefs(state),
      updateAccountConfig,
      configItem,
      convertDateTime,
      deactivateAccount,
      copyString,
    };
  },
});
</script>

<style scoped>
.detail_header {
  display: flex;
  padding: 15px 10px 5px 0px;
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
.form-field {
  display: block;
  text-align: left;
}
.form-value {
  padding: 10px;
  background: #f7f7f7;
  font-weight: 500;
  display: flex;
}
</style>
