<template>
    <div class="tabbar-box flex items-center">
        <div class="tabbar-indicate" :style="{ 'transform': `translate3d(${100 * aciveTabIndex}%,0,0)` }"></div>
        <div class="tabbar-item" @click="switchPgae(0)">
            <img src="../assets/tabBar/home-active.png" v-if="aciveTabIndex == 0" alt="">
            <img src="../assets/tabBar/home.png" v-else alt="">
            <span :class="{ 'active': aciveTabIndex == 0 }">{{ t('首页') }}</span>
        </div>
        <div class="tabbar-item" @click="switchPgae(1)">
            <img src="../assets/tabBar/explore-active.png" v-if="aciveTabIndex == 1" alt="">
            <img src="../assets/tabBar/explore.png" v-else alt="">
            <span :class="{ 'active': aciveTabIndex == 1 }">{{ t('发现') }}</span>
        </div>
        <div class="tabbar-item" @click="switchPgae(2)">
            <img src="../assets/tabBar/task-active.png" v-if="aciveTabIndex == 2" alt="">
            <img src="../assets/tabBar/task.png" v-else alt="">
            <span :class="{ 'active': aciveTabIndex == 2 }">{{ t('任务') }}</span>
        </div>
        <div class="tabbar-item" @click="switchPgae(3)">
            <img src="../assets/tabBar/my-active.png" v-if="aciveTabIndex == 3" alt="">
            <img src="../assets/tabBar/my.png" v-else alt="">
            <span :class="{ 'active': aciveTabIndex == 3 }">{{ t('我的') }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
let aciveTabIndex = ref(0);
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const emit = defineEmits();

function switchPgae(index) {
    if (index != aciveTabIndex.value) {
        aciveTabIndex.value = index;
        emit("onChange", index);
    }
}

onMounted(() => {
    let path = window.location.pathname;
    switch (path) {
        case "/":
            aciveTabIndex.value = 0;
            break;

        case "/home":
            aciveTabIndex.value = 0;
            break;

        case "/task":
            aciveTabIndex.value = 2;
            break;

        case "/user":
            aciveTabIndex.value = 3;
            break;
        default:
            aciveTabIndex.value = 0;
    }
})
</script>

<style lang="scss" scoped>
.tabbar-box {
    width: calc(100% - 16px);
    max-width: calc(750px - 16px);

    background: #262A2F;
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 10px;
    padding: 6px;

    .tabbar-item {
        position: relative;
        z-index: 1;
        width: 25%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 8px 0;

        span {
            color: #4E4F51;
            font-size: 13px;

            &.active {
                color: #BDC0C7;
            }
        }

        img {
            width: 30px;
            height: 30px;
        }
    }

    .tabbar-indicate {
        position: absolute;
        z-index: 0;
        width: calc((100% - 12px) / 4);
        height: calc(100% - 12px);
        border-radius: 10px;
        background-color: #1B1F24;
        transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
    }
}
</style>