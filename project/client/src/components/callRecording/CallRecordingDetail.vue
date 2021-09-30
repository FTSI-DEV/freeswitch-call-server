<template>
    <div class="call-recording-container">
        <div style="text-align: left; font-size: 1.3em">
            <router-link to="/call-recording">
                <ArrowLeftOutlined /> Back
            </router-link>
         </div>
        <div style="text-align: left">
            <div class="font-size: 1em;">Call Details</div>
            <div>
                <h5>Date Created: </h5>
            </div>
             <div>
                <h5>Recording Id: </h5>
            </div>
             <div>
                <h5>Recording UUID: </h5>
            </div>
             <div>
                <h5>Call UUIDI: </h5>
            </div>
             <div>
                <h5>File Path: </h5>
            </div>
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