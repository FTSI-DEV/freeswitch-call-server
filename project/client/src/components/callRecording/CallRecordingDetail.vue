<template>
    <div class="call-recording-container">
        <div style="text-align: left; font-size: 1.3em">
            <router-link to="/call-recording">
                <ArrowLeftOutlined /> Back
            </router-link>
         </div>
        <div>
            Call Recording Detail
        </div>
    </div>
</template>

<script lang="ts">
    import { useRouter } from "vue-router";
    import { defineComponent } from "vue";
    import { ArrowLeftOutlined } from "@ant-design/icons-vue";
    export default defineComponent({
        components: {
            ArrowLeftOutlined
        },
        setup() {
            const router = useRouter();
            const back = (): void => {
                router.push({ path: "/" });
            }
            return {
                back
            }
        }
    });
</script>