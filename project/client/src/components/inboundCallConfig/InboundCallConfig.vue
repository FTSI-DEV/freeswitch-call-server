<template>
  <div>
    <b-row v-if="inboundCallConfigData.length">
      <b-col>
        <a-table :dataSource="inboundCallConfigData" :columns="columns">
          <template #action="{ record }">
            <a title="Edit" @click="editConfig(record)"
              ><EditOutlined style="font-size: 1.2em; margin-right: 15px"
            /></a>
            <a title="Delete" @click="deleteConfig(record)">
              <DeleteOutlined style="font-size: 1.2em" />
            </a>
          </template>
        </a-table>
      </b-col>
    </b-row>
    <a-modal
      v-model:visible="modleVisibility"
      title="Edit Config"
      ok-text="Save"
      @ok="handleOk"
    >
      <a-form-item label="Caller Id" style="display: block; text-align: left">
        <input :class="['ant-input']" v-model="selectedConfig.callerId" />
      </a-form-item>

      <a-form-item label="HTTP Method" style="display: block; text-align: left">
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="setMethodUpdate('POST')">
                HTTP POST
              </a-menu-item>
              <a-menu-item key="2" @click="setMethodUpdate('GET')">
                HTTP GET
              </a-menu-item>
            </a-menu>
          </template>
          <a-button style="width: 100%; text-align: left">
            {{ selectedConfig.httpMethod }}
            <DownOutlined style="float: right; margin-top: 5px" />
          </a-button>
        </a-dropdown>
      </a-form-item>

      <a-form-item label="Webhook URL" style="display: block; text-align: left">
        <input :class="['ant-input']" v-model="selectedConfig.webhookUrl" />
      </a-form-item>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { EditOutlined, DownOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import gettersObj from "./helper/getters";
import methodsObj from "./helper/methods";

export default defineComponent({
  components: {
    EditOutlined,
    DownOutlined,
    DeleteOutlined,
  },
  setup() {
    const { inboundCallConfigData, inboundCallConfigById } = gettersObj();
    const {
      state,
      editConfig,
      deleteConfig,
      isInvalid,
      handleOk,
      saveConfig,
      setMethodUpdate,
      setMethod,
      fetchInitialData,
    } = methodsObj();

    fetchInitialData();

    return {
      ...toRefs(state),
      inboundCallConfigData,
      inboundCallConfigById,
      editConfig,
      deleteConfig,
      isInvalid,
      handleOk,
      saveConfig,
      setMethodUpdate,
      setMethod,
      fetchInitialData,
    };
  },
});
</script>
<style scoped>
.call-config {
  text-align: left;
  font-size: 1.5em;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20px;
}
.invalid {
  border: 1px solid red;
}
</style>
