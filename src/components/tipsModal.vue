<template>
    <Transition name="fade" v-show="show">
        <div class="tips-modal" :style="style()">
            <div v-for="item in list" class="tips-modal-item" @click.stop="handlerClick(item)">{{ item.label }}</div>
        </div>
    </Transition>
</template>

<script setup>

import { useI18n } from 'vue-i18n'
const { locale } = useI18n();

const emit = defineEmits();

// 定义组件接收的参数
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    list: {
        type: Array,
    },
    offsetX: {
        type: String,
        default: "0px"
    },
    offsetY: {
        type: String,
        default: "0px"
    }
})


function style() {
    return {
        "margin-left": props.offsetX,
        "margin-top": props.offsetY,
    }
}

function handlerClick(item) {
    if (locale.value != item.value) {
        locale.value = item.value;
    }

    setTimeout(() => {
        emit("update:show", false)
    }, 100);
}


</script>

<style lang="scss" scoped>
.tips-modal {
    position: absolute;
    z-index: 100;
    top: calc(100% + 4px);
    min-width: 50px;
    min-height: 40px;
    border-radius: 0.5rem;
    background-color: #303133;
    box-shadow: 0 0 14px 6px rgba(0, 0, 0, 0.2);
    padding: 4px 0;
    opacity: 1;
    // left: 50%;
    // transform: translate(-50%, 0);
    right: -4px;
}

.tips-modal-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px 20px;
    color: #fff;
    font-size: 16px;
    white-space: nowrap
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translate(0, 8px);
}
</style>