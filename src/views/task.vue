<template>
    <div class="page-box flex flex-col">

        <div class="money-box flex justify-center items-center">
            <img src="@/assets/img/coin-icon.png" style="width: 64px;height: 64px;" alt="">
            <span class="ml-2 text-white" style="font-size: 28px;">{{ thousandth(userStore.userInfo.points + "")
                }}</span>
        </div>

        <div class="main flex flex-col flex-1 pt-6 px-3 text-white">
            <span style="font-size: 15px;font-weight: bold;">{{ t('固定任务') }}</span>
            <div class="task-item mt-4" v-for="item in taskList" :key="item.name" @click="handlerTask(item)">
                <img class="left-img" :src="item.icon_url" alt="">
                <div>
                    <div>{{ item.name }}</div>
                    <div class="flex items-center mt-1">
                        <img src="@/assets/img/coin-icon.png" class="coin" alt="">
                        <span>+{{ item.reward }}</span>
                    </div>
                </div>

                <img src="@/assets/img/success-icon.png" class="right-icon" alt="" v-if="item.task_status == 3">
                <img src="@/assets/img/right-icon.png" class="right-icon" alt="" v-else>
            </div>

            <div class="flex justify-center items-center flex-col" v-if="notTask">
                <img src="@/assets/img/not-task.png" style="width: 117px;height: 117px;" alt="">
                <span class="mt-1 text-gray">{{ t('暂无新的任务') }}</span>
            </div>

            <span style="font-size: 15px;font-weight: bold;" class="mt-7">{{ t('每日任务') }}</span>
            <div class="task-item mt-4" @click="router.push('/signin')">
                <img class="left-img" src="@/assets/img/qiandao-icon.png" alt="">
                <div>
                    <div>{{ t('每日签到') }}</div>
                    <div class="flex items-center mt-1">
                        <img src="@/assets/img/coin-icon.png" class="coin" alt="">
                        <span>+{{ num }}</span>
                    </div>
                </div>

                <img src="@/assets/img/success-icon.png" class="right-icon" alt="" v-if="todayIsSign">
                <img src="@/assets/img/right-icon.png" class="right-icon" alt="" v-else>
            </div>
        </div>

        <Transition name="fade" v-show="show">
            <div class="popup-box px-4 pt-5">
                <div class="text-right" @click="show = false">
                    <van-icon name="cross" color="#fff" size="22px" />
                </div>

                <div class="flex flex-col justify-center items-center">
                    <img :src="pickTack.icon_url" style="width: 80px;height: 80px;border-radius: 6px;" alt="">
                    <div class="mt-5" style="font-size: 18px;">{{ pickTack.name }}</div>
                    <div class="mt-2">{{ t('奖励发放时间', { hour: pickTack.send_time }) }}</div>

                    <div class="flex items-center mt-5">
                        <img src="@/assets/img/coin-icon.png" style="width: 30px;height: 30px;" alt="">
                        <span style="font-size: 22px;">+{{ pickTack.reward }}</span>
                    </div>
                </div>

                <div class="btn" @click="commitTask">GO！</div>

            </div>
        </Transition>
    </div>
</template>

<script setup>
import { configApi, getTaskListApi, handlerTaskApi, refurSignApi } from '@/api/user';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

import { useRouter } from 'vue-router'
const router = useRouter();

import useUserStore from "@/store/userStore";
let userStore = useUserStore();

import dayjs from "dayjs"

let todayIsSign = ref(false);
let signConfig = ref({});
let signData = ref({});

let num = ref(0);   // 本日签到预计收益

let taskList = ref([]);
let notTask = ref(false);

let show = ref(false)
let pickTack = ref({});

onMounted(async () => {
    getTaskList();
    let [a, b] = await Promise.all([configApi(), refurSignApi()])
    signConfig.value = a.data.sign_list;
    signData.value = b.data;
    if (!signData.value.last_sign_in_time) {
        return num.value = signConfig.value[1];
    }
    todayIsSign.value = signData.value.last_sign_in_time.replace(/[ ].+/, "") == dayjs().format("YYYY-MM-DD");
    if (todayIsSign.value) {
        num.value = signConfig.value[Number(signData.value.consecutive_sign_in_days)]
    }
    else {
        if (signData.value.last_sign_in_time.replace(/[ ].+/, "") == dayjs(Date.now() - 86400 * 1000).format("YYYY-MM-DD")) {
            num.value = signConfig.value[Number(signData.value.consecutive_sign_in_days) + 1]
        }
        else {
            num.value = signConfig.value[1]
        }
    }
})

/**
 * 获取任务列表
 */
async function getTaskList() {
    let { data: { data } } = await getTaskListApi();
    taskList.value = data;
    notTask.value = data.length == 0;
}

async function handlerTask(item) {
    if (item.task_status > 1) return;
    pickTack.value = item;
    show.value = true;
}

async function commitTask() {
    await handlerTaskApi({ task_id: pickTack.value.id })
    window.open(pickTack.value.url)
}


function thousandth(data) {
    if (!data) return "";
    return data.replace(/(?!^)(?=(\d{3})+$)/g, ',');
}

</script>

<style lang="scss" scoped>
.page-box {
    height: 100vh;
    background: linear-gradient(180deg, #1B1F24 0%, #0F1115 100%);
}

.money-box {
    padding: 50px 0;
}

.main {
    background: linear-gradient(to top, #232832, #0D0F13);
    border-radius: 24px 24px 0 0;
    position: relative;
    border-top: 4px solid rgb(240, 175, 5);
    box-shadow: 0px -20px 35px rgba(240, 175, 5, .3);
    padding-bottom: 120px;
}

.task-item {
    background-color: $theme;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 3px 12px 3px 4px;

    &+& {
        margin-top: 10px;
    }

    .left-img {
        width: 57px;
        height: 57px;
        margin-right: 15px;
        border-radius: 4px;
    }

    .coin {
        width: 21px;
        height: 21px;
    }

    .right-icon {
        width: 20px;
        height: auto;
        margin-left: auto;
    }
}

.popup-box {
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    bottom: 0;
    height: 400px;
    background: linear-gradient(to top, #232832, #0D0F13);
    border-radius: 24px 24px 0 0;
    border-top: 1px solid rgb(240, 175, 5);
    box-shadow: 0px -10px 20px rgba(240, 175, 5, .5);
    transform: translate3d(0, 0, 0);
    opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
}

.btn {
    background-color: #5960FF;
    height: 58px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    border-radius: 16px;
    margin-top: 30px;
}
</style>