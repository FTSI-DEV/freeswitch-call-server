<template>
  <a-layout>
    <a-layout style="padding: 24px 24px 24px">
      <a-layout-content
        :style="{
          background: '#fff',
          padding: '24px',
          margin: 0,
          minHeight: '280px',
        }"
      >
        <a-row>
          <a-col>
            <div style="background: white; padding: 20px">
              <div class="call-config">Phone Number Config</div>
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
                  <a-form-item
                    label="Friendly Name"
                    style="display: block; text-align: left"
                  >
                    <input
                      :class="['ant-input', isInvalid(friendlyName)]"
                      v-model="friendlyName"
                    />
                  </a-form-item>
                </a-col>
                <a-col style="margin-right: 15px">
                  <a-form-item
                    label="Phone Number"
                    style="display: block; text-align: left"
                  >
                    <!-- <a-input-number v-model="phoneNumber" style="width: 100%" /> -->
                    <input
                      :class="['ant-input', isInvalid(phoneNumber)]"
                      v-model="phoneNumber"
                    />
                  </a-form-item>
                </a-col>
                <a-col style="margin-right: 15px">
                  <a-form-item
                    label="HTTP Method"
                    style="display: block; text-align: left"
                  >
                    <a-dropdown>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item key="1" @click="setMethod('POST')">
                            HTTP POST
                          </a-menu-item>
                          <a-menu-item key="2" @click="setMethod('GET')">
                            HTTP GET
                          </a-menu-item>
                        </a-menu>
                      </template>
                      <a-button style="width: 100%; text-align: left">
                        {{ selectedHttpMethod }}
                        <DownOutlined style="float: right; margin-top: 5px" />
                      </a-button>
                    </a-dropdown>
                  </a-form-item>
                </a-col>
                <a-col style="margin-right: 15px">
                  <a-form-item
                    label="Webhook URL"
                    style="display: block; text-align: left"
                  >
                    <!-- <a-input v-model="webhookURL" /> -->
                    <input
                      :class="['ant-input', isInvalid(webhookURL)]"
                      v-model="webhookURL"
                    />
                  </a-form-item>
                </a-col>
                <a-col>
                  <a-form-item style="text-align: left">
                    <a-button
                      type="primary"
                      @click="saveConfig"
                      style="margin-top: 32px"
                    >
                      Save
                    </a-button>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row> 
        <b-row v-if="phoneNumberConfigList.length">
          <b-col>
            <a-table :data-source="phoneNumberConfigList" :columns="columns">
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
          <a-form-item
            label="Friendly Name"
            style="display: block; text-align: left"
          >
            <input
              :class="['ant-input']"
              v-model="selectedConfig.friendlyName"
            />
          </a-form-item>
          <a-form-item
            label="Phone Number"
            style="display: block; text-align: left"
          >
            <input
              :class="['ant-input']"
              v-model="selectedConfig.phoneNumber"
            />
          </a-form-item>
          <a-form-item
            label="HTTP Method"
            style="display: block; text-align: left"
          >
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
          <a-form-item
            label="Webhook URL"
            style="display: block; text-align: left"
          >
            <input :class="['ant-input']" v-model="selectedConfig.webhookUrl" />
          </a-form-item>
        </a-modal>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import { 
  defineComponent, 
  toRefs,
} from "vue";
import {
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import gettersObj from "./helper/getters";
import methodsObj from "./helper/methods";

export default defineComponent({
  components: { 
    DownOutlined, 
    EditOutlined, 
    DeleteOutlined 
  },
  setup() {
    const {
      phoneNumberConfigList,
      phoneNumberConfig
    } = gettersObj();
    const {
      state,
      selectedHttpMethod,
      setMethodUpdate,
      getPhoneNumberConfigs,
      deleteConfig,
      handleOk,
      editConfig,
      isInvalid,
      setMethod,
      saveConfig,
    } = methodsObj();

    getPhoneNumberConfigs();

    return {
      ...toRefs(state),
      selectedHttpMethod,
      phoneNumberConfigList,
      phoneNumberConfig,
      setMethodUpdate,
      getPhoneNumberConfigs,
      deleteConfig,
      handleOk,
      editConfig,
      isInvalid,
      setMethod,
      saveConfig,
    }
  }
});
</script>
<style scoped>
.call-config {
  text-align: left;
  font-size: 2em;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20px;
}
.invalid {
  border: 1px solid red;
}
</style>