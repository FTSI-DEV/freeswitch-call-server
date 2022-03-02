<template>
  <a-layout>
    <div class="grid-container" style="padding: 0px 10px 10px 0px">
      <div class="config-item" @click="navigateRoute('phone-number')">
        <NumberOutlined class="config-icon"/>
        <div class="config-label"> Phone number</div>
      </div>
      <div class="config-item" @click="navigateRoute('inbound')">
        <PhoneOutlined class="config-icon"/>
        <div class="config-label"> Inbound </div>
      </div>
      <div class="config-item" @click="navigateRoute('ivr')">
        <ApartmentOutlined class="config-icon"/>
        <div class="config-label"> IVR</div>
      </div>
    </div>
  </a-layout>
</template>
<script lang="ts">
  import { defineComponent } from "vue";
  import { PhoneOutlined, NumberOutlined, ApartmentOutlined} from "@ant-design/icons-vue";
  import { useRouter } from "vue-router"
  
  export default defineComponent({
    components: { PhoneOutlined, NumberOutlined, ApartmentOutlined },
    setup() {
      const router = useRouter();

      const navigateRoute = (path: string) => {
        router.push({ path: `/call-config-new/${path}` });
      }

      return {
        navigateRoute
      }
    },
  });
</script>
<style>
  .grid-container {
    display: grid;
    grid-template-columns: 250px 250px 250px;
    grid-gap: 10px;
    /* background-color: #2196F3; */
    padding: 5px;
  }

  .grid-container>div {
    padding: 10px 0px;
  }

  .config-item {
    display: block;
    text-align: center;
    box-shadow: 1px 1px 15px #dfdfdf;
    background: white;
    border-radius: 5px;
    cursor: pointer;
  }
  .config-item:hover {
    box-shadow: 1px 1px 15px #bebebe;
  }
  .config-icon {
    font-size: 3em;
  }
  .config-label {
    font-size: 1.3em;
    margin-top: 17px;
  }
</style>