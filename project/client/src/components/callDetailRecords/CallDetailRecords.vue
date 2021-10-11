<template>
  <div style="padding: 10px">
    <div class="call-config">Call Logs</div>
    <!-- <a-list item-layout="horizontal" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item style="text-align: left">
          <a-list-item-meta>
            <template #title>
              <a href="https://www.antdv.com/">{{ item.title }}</a>
            </template>
            <template #avatar>
              <a-avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
            </template>
            <template #description>
              <div>
                Ant Design, a design language for background applications, is
                refined by Ant UED Team
              </div>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list> -->
    <a-table :dataSource="cdrData" :columns="CDRColumns">
      <!-- <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #customTitle>
        <span>
          <smile-outlined />
          Namesa
        </span>
      </template> -->
      <template #CallDirection="{ text }">
        <span>
          <a-tag :color="'green'"> {{ text }} </a-tag>
        </span>
      </template>
      <template #action="{ record }">
        <router-link to="/call-logs/details">
          <MenuFoldOutlined
            @click="viewDetails(record)"
            class="view_icon"
            title="View Details"
          />
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
</style>
