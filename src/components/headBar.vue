<template>
    <div class="head-bar-box" @click="router.back()">
        <img src="@/assets/img/back-icon.png" style="width: 14px;height: auto;" alt="">
        <span style="margin-left: 10px;color: #fff;font-size: 17px;">{{ title }}</span>
    </div>
</template>

<script setup>
const router = useRouter();

const props = defineProps({
    title: {
        type: String,
        default:""
    }
})
</script>

<style lang="scss" scoped>
.head-bar-box {
    height: 44px;
    padding: 0 10px;
    padding-top: 10px;
    display: flex;
    align-items: center;
}
</style>