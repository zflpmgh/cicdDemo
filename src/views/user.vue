<template>
    <div class="page-box">
        <my-nav />

        <div class="main px-3 flex flex-col text-white">
            <div class="flex floor">
                <div class="flex-1 flex flex-col justify-center items-center">
                    <span style="color: #E3B82C;">{{ t('我的等级') }}</span>
                    <span class="text-white mt-2" style="font-size: 20px;">Lv {{ userStore.userInfo.level }}</span>
                </div>
                <div class="flex-1 flex flex-col justify-center items-center ml-2">
                    <span style="color: #DC5EFF;">{{ t('累计获得奖励') }}</span>
                    <div class="flex items-center mt-2">
                        <!-- <img src="@/assets/img/wallet-icon.png" style="width: 27px;height: 27px;" alt=""> -->
                        <span class="ml-2 text-white" style="font-size: 20px;">
                            {{ thousandth(userStore.userInfo.points + "") }}
                        </span>
                    </div>
                </div>
                <div class="flex-1 flex flex-col justify-center items-center ml-2">
                    <span style="color: #E3B82C;">Ai Point</span>
                    <span class="text-white mt-2" style="font-size: 20px;">{{ parseFloat(wallet[1]?.money || 0) }}</span>
                </div>
            </div>
            <img src="@/assets/img/user-banner.png" style="width: 100%;height: auto;" class="mt-4" alt="">

            <span class="mt-5" style="font-size: 15px;font-weight: bold;">{{ t('其他设置') }}</span>
            <div class="task-item mt-4" @click="router.push(`/team`)">
                <img class="left-img" src="@/assets/img/friend-icon.png" alt="">
                <div>
                    <div>{{ t('我的好友') }}</div>
                    <div class="flex items-center mt-1">
                        <img src="@/assets/img/wallet-icon.png" class="coin" alt="">
                        <span class="text-gray">{{ t('邀请好友可获得奖励') }}</span>
                    </div>
                </div>
                <img src="@/assets/img/right-icon.png" class="right-icon" alt="">
            </div>

            <div class="task-item">
                <img class="left-img" src="@/assets/img/share-icon.png" alt="">
                <div>
                    <div>{{ t('分享链接') }}</div>
                    <div class="flex items-center mt-1">
                        <img src="@/assets/img/star-icon.png" class="coin" alt="">
                        <span class="text-gray">{{ t('点击右侧图标复制邀请链接') }}</span>
                    </div>
                </div>
                <div class="ml-auto flex items-center">
                    <img src="@/assets/img/copy-icon.png" class="right-icon" @click="copy">
                    <span>{{ t('复制') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import MyNav from '@/components/myNav.vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

import useUserStore from "@/store/userStore";
let userStore = useUserStore();

const router = useRouter();


import { copyText } from "@/utils/util"
import { walletApi } from '@/api/user';

let wallet = ref([]);

onMounted(() => {
    userStore.updateUserInfo();
    getWallet();
})


function thousandth(data) {
    if (!data) return "";
    return data.replace(/(?!^)(?=(\d{3})+$)/g, ',');
}

async function copy() {
    try {
        await copyText(`${window.location.origin}?recom_code=${userStore.userInfo.recom_code}`);
        showNotify({ type: 'success', message: t('复制成功') });
    } catch (error) {

    }

}

async function getWallet() {
    let { data: { coins } } = await walletApi()
    wallet.value = coins;
}

</script>

<style lang="scss" scoped>
.floor>div {
    background-color: $theme;
    padding: 10px 0;
    border-radius: 12px;
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

    span {
        font-size: 13px;
        margin-left: 4px;
    }
}
</style>