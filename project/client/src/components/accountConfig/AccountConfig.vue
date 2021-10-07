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
      const authToken = localStorage.getItem("fs_auth_token");
      store.dispatch("getAccountConfigs", { params: { page: 1, limit: 1 }, authToken });
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
