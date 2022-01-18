<template>
  <div>
    <a-page-header :style="{
        background: '#fff',
        padding: '0px 10px 10px 10px',
        textAlign: 'left',
        marginBottom: '5px'
    }" @back="() => null"> <span class="page-title"> Call Logs</span>
    </a-page-header>
    <a-table :dataSource="cdrData" :columns="CDRColumns">
      <template #CallDirection="{ text }">
        <span>
          <a-tag :color="'green'"> {{ text }} </a-tag>
        </span>
      </template>
      <template #action="{ record }">
        <router-link to="/call-logs/details">
          <MenuFoldOutlined @click="viewDetails(record)" class="view_icon" title="View Details" />
        </router-link>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts">
  // import { EditOutlined } from "@ant-design/icons-vue";
  import { defineComponent, computed } from "vue";
  import { useStore } from "vuex";
  import { CDRColumns } from "./helper/helper";
  import methodsObj from "./helper/methods";
  import { MenuFoldOutlined } from "@ant-design/icons-vue";
  export default defineComponent({
    components: {
      MenuFoldOutlined,
    },
    setup() {
      const store = useStore();
      const { getCallDetailRecords, viewDetails } = methodsObj();
      const cdrData = computed(() => store.getters["getCallDetailRecords"]);
      getCallDetailRecords();
      return {
        CDRColumns,
        cdrData,
        viewDetails,
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

  .view_icon {
    font-size: 1.4em;
    color: #3d56b2;
    cursor: pointer;
  }

  .view_icon:hover {
    transform: scale(1.5);
  }

  .page-title {
    font-size: 1.5em;
    font-weight: 600;
    color: #5e5e5e;
  }
</style>