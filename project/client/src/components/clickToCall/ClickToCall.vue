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
            <div style="padding: 20px">
              <div class="call-config">Click To Call</div>
              <a-row>
                <a-col style="margin-right: 15px">
                  <a-form-item
                    label="From"
                    style="display: block; text-align: left"
                  >
                    <input
                      :class="['ant-input', isInvalid(from)]"
                      v-model="from"
                    />
                  </a-form-item>
                </a-col>
                <a-col style="margin-right: 15px">
                  <a-form-item
                    label="To"
                    style="display: block; text-align: left"
                  >
                    <input :class="['ant-input', isInvalid(to)]" v-model="to" />
                  </a-form-item>
                </a-col>
                <a-col style="margin-right: 15px">
                  <a-form-item
                    label="Caller Id"
                    style="display: block; text-align: left"
                  >
                    <input
                      :class="['ant-input', isInvalid(callerId)]"
                      v-model="callerId"
                    />
                  </a-form-item>
                </a-col>
                <a-col>
                  <a-form-item style="text-align: left">
                    <a-button
                      type="danger"
                      @click="clickToCall"
                      style="margin-top: 32px"
                    >
                      Call
                    </a-button>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">

import { reactive, toRefs, defineComponent } from "vue";
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    const state = reactive({
      from: null,
      to: null,
      callerId: null,
      hasError: false,
    })

    // Methods
    const isInvalid = (value: string): string => !value && state.hasError ? "invalid" : "";
    const clickToCall = () => {
      if (!state.from || !state.to || !state.callerId) {
        state.hasError = true;
        return;
      }
      state.hasError = false;
      const params = {
        phoneNumberFrom: state.from,
        phoneNumberTo: state.to,
        callerId: state.callerId,
      };
      store.dispatch("clickToCall", params);
    }

    return {
      ...toRefs(state),
      isInvalid,
      clickToCall
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