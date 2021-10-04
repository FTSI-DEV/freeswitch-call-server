<template>
  <div style="padding: 10px">
    <div class="account-config">
      Account List
      <PlusSquareFilled
        style="color: #57cc99; cursor: pointer; margin-left: 6px"
        @click="addAccountConfig"
        title="Add Account Config"
      />
    </div>
    <!-- <a-row>
      <a-col style="margin-right: 15px">
        <a-form-item label="Account Name" style="display: block; text-align: left">
          <input :class="['ant-input', isInvalid(acountName)]" v-model="acountName" />
        </a-form-item>
      </a-col>
      <a-col style="margin-right: 15px">
        <a-form-item label="Account SID" style="display: block; text-align: left">
          <input :class="['ant-input', isInvalid(accountSID)]" v-model="accountSID" />
        </a-form-item>
      </a-col>
      <a-col style="margin-right: 35px">
        <a-form-item style="display: block; text-align: left">
          <a-form-item label="Active" style="display: block; text-align: left">
            <a-checkbox v-model:checked="isActive" />
          </a-form-item>
        </a-form-item>
      </a-col>
      <a-col>
        <a-form-item style="text-align: left">
          <a-button type="primary" @click="saveAccountConfig" style="margin-top: 32px">
            Save
          </a-button>
        </a-form-item>
      </a-col>
    </a-row> -->
    <a-table :columns="columns" :dataSource="accountConfigs">
      <template #accountName="{ record }">
        {{ record.accountName }}

        <router-link to="/account-config/details" style="position: absolute; right: 15px">
          <MenuFoldOutlined
            class="view_icon"
            title="View Details"
            @click="viewDetails(record)"
          />
        </router-link>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, computed } from "vue";
import { useStore } from "vuex";
import { AccountConfigItem } from "../../types/accountConfig";
import AccountConfigColumn from "./helper/helper";
import { MenuFoldOutlined, PlusSquareFilled } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
export default defineComponent({
  components: { MenuFoldOutlined, PlusSquareFilled },
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      acountName: "",
      accountSID: "",
      isActive: false,
      hasError: false,
      columns: AccountConfigColumn,
    });
    const accountConfigs = computed(
      (): AccountConfigItem[] => store.getters["getAccountConfigs"]
    );
    const getAccountConfigs = () => {
      store.dispatch("getAccountConfigs");
    };
    const saveAccountConfig = () => {
      store.dispatch("addAccountConfig");
    };
    const viewDetails = (item: any) => {
      console.log(item);
    };
    const addAccountConfig = () => {
      router.push({ path: "/account-config/add" });
    };
    // const isInvalid = (value: string): string => !value && state.hasError ? "invalid" : "";
    const isInvalid = () => "";

    getAccountConfigs();
    return {
      ...toRefs(state),
      getAccountConfigs,
      isInvalid,
      saveAccountConfig,
      accountConfigs,
      viewDetails,
      addAccountConfig,
    };
  },
});
</script>
<style scoped>
.account-config {
  text-align: left;
  font-size: 1.5em;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20px;
}
.invalid {
  border: 1px solid red;
}
.view_icon {
  font-size: 1.4em;
  color: #3d56b2;
  cursor: pointer;
}
.view_icon:hover {
  transform: scale(1.5);
}
</style>
