<template>
  <div>
    <a-form-item label="From" style="display: block; text-align: left">
      <input :class="['ant-input', isInvalid(from)]" v-model="from" />
    </a-form-item>
    <a-form-item label="To" style="display: block; text-align: left">
      <input :class="['ant-input', isInvalid(to)]" v-model="to" />
    </a-form-item>
    <a-form-item label="Caller Id" style="display: block; text-align: left">
      <input :class="['ant-input', isInvalid(callerId)]" v-model="callerId" />
    </a-form-item>
  </div>
</template>
<script lang="ts">
import { toRefs, defineComponent } from "vue";
import methodsObj from "./helper/method";

export default defineComponent({
  setup() {
    const { isInvalid, state, clickToCall } = methodsObj();
    return {
      ...toRefs(state),
      isInvalid,
      clickToCall,
    };
  },
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
