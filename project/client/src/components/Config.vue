<template>
    <div>
        <a-row>
            <a-col :span="10">
                <div style="background: white; padding: 20px; margin-top: 15px">
                    <div class="call-config"> Config </div>
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
                        <a-button type="primary" @click="saveConfig"> Save </a-button>
                    </a-form-item>
                </div>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="10">
                <div style="padding: 20px;">
                    <div class="call-config"> Click To Call </div>
                    <a-row>
                        <a-col :span="6" style="margin-right: 20px;">
                            <a-form-item label="From">
                                <input class="ant-input" v-model="from" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="To" style="margin-right: 20px;">
                                <input class="ant-input" v-model="to" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6" style="margin-right: 20px;">
                            <a-form-item label="Caller Id">
                                <input class="ant-input" v-model="callerId" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="3" style="position: relative;">
                            <a-button 
                                type="danger" 
                                @click="clickToCall" 
                                style="position: absolute;right: 0px;top: 32px;"> 
                                Call 
                            </a-button>
                        </a-col>
                    </a-row>
                </div>
            </a-col>
        </a-row>
    </div>
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
                from: null,
                to: null,
                callerId: null,
            }
        },
        methods: {
            saveConfig() {
                console.log('saveConfig: ')
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
            clickToCall() {
                const params = {
                    phoneNumberFrom: this.from,
                    phoneNumberTo: this.to,
                    callerId: this.callerId,
                }
                EventService.clickToCall(params);
                console.log('params: ', params);
            }
        }
    }
</script>
<style scoped>
    .call-config {
        text-align: left;
        font-size: 2em;
        border-bottom: 1px solid #eaeaea;
        margin-bottom: 20px;
    }
</style>