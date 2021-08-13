<template>
    <a-row>
        <a-col :span="10">
            <div style="background: white; padding: 20px; margin-top: 15px">
                <a-form-item label="Friendly Name">
                    <input class="ant-input" v-model="friendlyName" />
                </a-form-item>
                <a-form-item label="Phone Number">
                    <!-- <a-input-number v-model="phoneNumber" style="width: 100%" /> -->
                    <input class="ant-input" v-model="phoneNumber" />
                </a-form-item>
                <a-form-item label="HTTP Method">
                    <!-- <a-input v-model="httpMethod" /> -->
                    <input class="ant-input" v-model="httpMethod" />
                </a-form-item>
                <a-form-item label="Webhook URL">
                    <!-- <a-input v-model="webhookURL" /> -->
                    <input class="ant-input" v-model="webhookURL" />
                </a-form-item>
                <a-form-item style="text-align: left;">
                    <a-button type="primary" @click="saveConfig"> Submit </a-button>
                </a-form-item>
            </div>
        </a-col>
    </a-row>
</template>
<script>
    import EventService from '../services/EventService.ts';
    export default {
        data() {
            return {
                friendlyName: null,
                phoneNumber: null,
                httpMethod: null,
                webhookURL: null,
            }
        },
        methods: {
            saveConfig() {
                const params = {
                    friendlyName: this.friendlyName,
                    phoneNumber: this.phoneNumber,
                    httpMethod: this.httpMethod,
                    webhookUrl: this.webhookURL,
                }
                EventService.saveRecord(params).then(res => {
                    console.log('Save config return: ', res);
                })
                console.log(params)
            },
        },
        created() {
            EventService.getCallConfigById(1).then(res => {
                console.log('getCallConfigById returnn: ', res)
            })
        }
    }
</script>