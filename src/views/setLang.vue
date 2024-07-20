<template>
    <div class="page-box flex flex-col">
        <div class="main flex-1">
            <div class="flex items-center justify-between" style="height: 50px;">
                <div>
                    <div style="font-size: 19px;">{{ t('语言') }}</div>
                    <div class="text-gray mt-1" style="font-size: 13px;">{{ t('你可以在这里更改语言') }}</div>
                </div>
                <van-icon name="cross" color="#fff" size="22px" @click="router.back()" />
            </div>

            <div class="list px-1 mt-2">
                <div class="item flex items-center" :class="{ 'active': activeIndex == index }"
                    v-for="(item, index) in langList" @click="handlerClick(item, index)">
                    <img :src="item.flag" class="flag-img" alt="">
                    <span class="ml-3" style="font-weight: bold;">{{ item.label }}</span>
                </div>
            </div>

            <div class="btn" @click="save">{{ t('保存') }}</div>
        </div>
    </div>
</template>

<script setup>
import router from '@/router';
import Cache from '@/utils/cache';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();

function getAssetsUrl(name) {
    return new URL(name, window.location.origin + "/src/assets/").href
}

let langList = ref([
    { label: "English", value: "en-us", flag: getAssetsUrl("flags/us.png") },
    { label: "繁體中文", value: "zh-cn", flag: getAssetsUrl("flags/tw.jpg") },
])

let _activeIndex = langList.value.findIndex(item => item.value == locale.value);

let activeIndex = ref(_activeIndex);

function handlerClick(item, index) {
    if (locale.value != item.value) {
        activeIndex.value = index;
        locale.value = item.value;
    }
}

function save() {
    Cache.set("MiguelLocale", locale.value);
    showNotify({ type: 'success', message: t('语言设置已保存') })

    setTimeout(() => {
        router.push("/")
    }, 1000);
}
</script>

<style lang="scss" scoped>
.page-box {
    height: 100vh;
    padding: 12px;
    color: #fff;
    background: #000;

    .main {
        height: 0px;
        border-radius: 12px;
        padding: 14px;
        background-color: #13151B;
        display: flex;
        flex-direction: column;
    }

    .list {
        flex: 1;
        height: 0;
        overflow: scroll;
        padding: 15px 0;
    }

    .item {
        border: 1px solid rgba(128, 128, 128, 0.5);
        border-radius: 16px;
        padding: 12px 14px;

        .flag-img {
            width: 37px;
            height: 37px;
            border-radius: 50%;
        }

        &.active {
            border-color: #AC50CD;
        }
    }

    .item+.item {
        margin-top: 12px;
    }

    .btn {
        background-color: #AC50CD;
        height: 58px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 17px;
        border-radius: 16px;
        margin-top: auto;
    }
}
</style>