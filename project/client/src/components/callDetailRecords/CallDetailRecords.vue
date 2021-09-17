<template>
  <div>
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
    <a-table :columns="CDRColumns" :data-source="data">
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #customTitle>
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
      <template #callStatus="{ text }">
        <span>
          <a-tag :color="'green'"> {{ text }} </a-tag>
        </span>
      </template>
      <!-- <template #action="{ record }">
        <a title="Edit" @click="editConfig(record)"
          ><EditOutlined style="font-size: 1.2em; margin-right: 15px" />
        </a>
      </template> -->
    </a-table>
  </div>
</template>
<script lang="ts">
// import { EditOutlined } from "@ant-design/icons-vue";
import { defineComponent } from "vue";
import { data, CDRColumns } from "./helper/helper";
import methodsObj from "./helper/methods";
// interface DataItem {
//   title: string;
// }
// const data: DataItem[] = [
//   {
//     title: "Ant Design Title 1",
//   },
//   {
//     title: "Ant Design Title 2",
//   },
//   {
//     title: "Ant Design Title 3",
//   },
//   {
//     title: "Ant Design Title 4",
//   },
// ];
export default defineComponent({
  components: {
    // EditOutlined,
  },
  setup() {
    const { getCallDetailRecords } = methodsObj();

    getCallDetailRecords();
    const editConfig = (data: any) => {
      console.log(data);
    };
    return {
      data,
      CDRColumns,
      editConfig,
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
</style>
