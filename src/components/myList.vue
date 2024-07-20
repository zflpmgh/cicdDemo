<template>
    <div id="list-box" :style="{ 'height': height }" @scroll="onScroll">
        <slot />
    </div>
</template>

<script setup>
const debounce = (fn, delay = 1000) => {
    let timer = null;
    return function (...args) {
        const context = this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
            timer = null;
        }, delay);
    }
}

/** @type {HTMLDivElement} */
let that = ref(null);

const props = defineProps({
    height: {
        type: String,
        default: "100%"
    },
})

const emit = defineEmits();

onMounted(() => {
    setTimeout(() => {
        that.value = document.getElementById("list-box");
    }, 40);
})

const onScroll = debounce(function () {
    let scrollTop = that.value.scrollTop;

    let clientHeight = that.value.clientHeight;

    let scrollHeight = that.value.scrollHeight;

    if (scrollHeight > clientHeight && (scrollTop + clientHeight >= scrollHeight - 10)) {
        emit("lower");
    }
}, 50)


</script>

<style lang="scss" scoped>
#list-box {
    overflow-y: scroll;
}
</style>