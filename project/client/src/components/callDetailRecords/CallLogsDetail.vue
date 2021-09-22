<template>
    <div class="call-recording-container">
        <div style="text-align: left; font-size: 1.3em">
            <router-link to="/call-logs">
                <ArrowLeftOutlined /> Back
            </router-link>
         </div>
        <div>
            Call Logs Detail
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import { ArrowLeftOutlined } from "@ant-design/icons-vue";
    export default defineComponent({
        components: {
            ArrowLeftOutlined
        },
    });
</script>