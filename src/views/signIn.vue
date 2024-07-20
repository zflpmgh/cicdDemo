<template>
    <div class="page-box flex flex-col">
        <head-bar :title="t('每日签到')" />
        <div style="height: 40px;"></div>
        <div class="main flex flex-col flex-1 pt-6 px-3 text-white">
            <div class="flex flex-col justify-center items-center">
                <img src="@/assets/img/qiandao-icon.png" style="width: 128px;height: auto;" alt="">
                <div style="font-size: 28px;" class="mt-3">{{ t('每日签到') }}</div>
                <span class="text-gray mt-1" style="font-size: 14px;">{{ t('每日签到可获得奖励') }}</span>
            </div>

            <div class="sign-list flex flex-wrap">
                <div v-for="(item, index) in list" class="item"
                    :class="{ 'active': index < userStore.userInfo.consecutive_sign_in_days }">
                    <span>Day{{ index + 1 }}</span>
                    <img src="@/assets/img/coin-icon.png" style="width: 28px;height: auto;margin: 8px 0;" alt="">
                    <span>{{ kUnit(signConfig[index + 1]) }}</span>
                </div>
            </div>

            <div class="btn flex justify-center items-center" @click="commit">GO!</div>
        </div>
    </div>
</template>

<script setup>

import { ref } from "vue"

import HeadBar from '@/components/headBar.vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

import { signApi, configApi } from "@/api/user";
import useUserStore from "@/store/userStore";
let userStore = useUserStore();

import dayjs from "dayjs"
import { kUnit } from "@/utils/util";


let _list = new Array(10).fill("");
let list = ref(_list);

let signConfig = ref({});

onMounted(async () => {
    userStore.updateUserInfo();
    let { data: { sign_list } } = await configApi();
    signConfig.value = sign_list;
})


async function commit() {
    try {
        if (userStore.userInfo.last_sign_in_time && userStore.userInfo.last_sign_in_time.replace(/[ ].+/, "") == dayjs().format("YYYY-MM-DD")) {
            return showNotify({ type: 'danger', message: t('你本日已签到') })
        }
        await signApi();
        userStore.updateUserInfo();
        showNotify({ type: 'success', message: t('签到成功') })
    } catch (error) {

    }
}


</script>

<style lang="scss" scoped>
.page-box {
    height: 100vh;
}

.main {
    background: linear-gradient(to top, #232832, #0D0F13);
    border-radius: 24px 24px 0 0;
    position: relative;
    border-top: 4px solid rgb(240, 175, 5);
    box-shadow: 0px -20px 35px rgba(240, 175, 5, .3);
}

.sign-list {
    margin-top: 1.2rem;

    .item {
        width: calc((100% - 30px) /4);
        margin-left: 10px;
        background: #333844;
        color: #FFF9F9;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        margin-top: 8px;
        padding: 6px 0;

        &.active {
            color: #fff;
            background: linear-gradient(180deg, #52CC61 0%, #24772D 100%);
        }
    }

    & .item:nth-child(4n+1) {
        margin-left: 0 !important;
    }
}

.btn {
    height: 50px;
    border-radius: 7px;
    background: linear-gradient(180deg, #50C85F 0%, #287E31 100%);
    margin-top: 1.7rem;
    font-size: 24px;
}
</style>