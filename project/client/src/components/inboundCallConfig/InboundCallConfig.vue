<template>
  <a-layout>
    <div style="background: white; padding: 20px; padding-top: 0">
      <a-alert
        v-if="isSaved && !hasError"
        message="Successfully saved"
        type="success"
        style="text-align: left; margin-bottom: 5px"
      />
      <a-aler
        v-if="isServerError"
        message="Error"
        type="error"
        style="text-align: left; margin-bottom: 5px"
      />
      <a-row>
         <a-col style="margin-right: 15px">
          <a-form-item label="Account Id" style="display: block; text-align: left">
            <input :class="['ant-input', isInvalid(accountId)]" v-model="accountId" />
          </a-form-item>
        </a-col>
        <a-col style="margin-right: 15px">
          <a-form-item label="Caller Id" style="display: block; text-align: left">
            <input :class="['ant-input', isInvalid(callerId)]" v-model="callerId" />
          </a-form-item>
        </a-col>

        <a-col style="margin-right: 15px">
          <a-form-item label="HTTP Method" style="display: block; text-align: left">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="setMethod('POST')">
                    HTTP POST
                  </a-menu-item>
                  <a-menu-item key="2" @click="setMethod('GET')"> HTTP GET </a-menu-item>
                </a-menu>
              </template>
              <a-button style="width: 100%; text-align: left">
                {{ selectedHttpMethod }}
                <DownOutlined style="float: right; margin-top: 5px" />
              </a-button>
            </a-dropdown>
          </a-form-item>
        </a-col>

        <a-col style="margin-right: 15px" :span="8">
          <a-form-item label="Webhook Url" style="display: block; text-align: left">
            <input :class="['ant-input', isInvalid(webhookUrl)]" v-model="webhookUrl" />
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item style="text-align: left">
            <a-button type="primary" @click="saveConfig" style="margin-top: 32px">
              Save
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </div>

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
  </a-layout>
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
      selectedHttpMethod,
    } = methodsObj();

    fetchInitialData();

    return {
      ...toRefs(state),
      selectedHttpMethod,
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
