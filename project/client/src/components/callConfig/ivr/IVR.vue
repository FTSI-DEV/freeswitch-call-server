<template>
    <div>
        <a-page-header :style="{
        background: '#fff',
        padding: '0px 10px 10px 10px',
        textAlign: 'left'
    }" @back="() => null"> IVR Config </a-page-header>
        <a-layout-content :style="{
        background: '#fff',
        padding: '24px',
        marginTop: '5px',
        minHeight: '280px',
        fontSize: '1.3em',
      }"> </a-layout-content>
    </div>
</template>
<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        setup() {
            console.log("Setup from IVR Config")
        }
    })
</script>