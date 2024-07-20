<template>
    <div>
        <div class="flex items-center px-3 py-4 text-white" style="font-size: 13px;">
            <div v-if="userStore.isLogin" class="flex items-center" @click="router.push(`/setting`)">
                <img :src="userStore.userInfo.avatar_url" style="width: 42px;height: 42px;" alt="">
                <div class="ml-3 flex flex-col" >
                    <span>{{ userStore.userInfo.nickname }}</span>
                    <span>{{ address }}</span>
                </div>
            </div>


            <div class="switch-lang-box" @click="router.push(`/setLang`)">
                <img src="../assets/img/en-icon.png" v-if="locale == 'en-us'">
                <img src="../assets/img/zh-icon.png" v-if="locale == 'zh-cn'">
                <tips-modal :list="list" v-model:show="showLangTips" offset-y="4px"></tips-modal>
            </div>
        </div>
        <div class="tips-modal-mask" v-if="showLangTips" @click="showLangTips = false"></div>
    </div>
</template>

<script setup>

import TipsModal from "./tipsModal.vue";

import useUserStore from "@/store/userStore";
let userStore = useUserStore();

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();

const router = useRouter();


let list = ref([
    { label: "繁體中文", value: "zh-cn" },
    { label: "English", value: "en-us" },
])

let showLangTips = ref(false);

let address = computed(() => {
    if (!userStore.userInfo.name) return "";
    return userStore.userInfo.name.replace(/^(\w{8})\w+(\w{8})$/, "$1....$2")
})
</script>

<style lang="scss" scoped>
.switch-lang-box {
    width: 42px;
    height: 42px;
    margin-left: auto;
    position: relative;

    img {
        width: 100%;
        height: 100%;
    }
}

.tips-modal-mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 90;
}
</style>