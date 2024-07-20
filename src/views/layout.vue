<template>
    <div>
        <router-view style="width: 100%;"></router-view>
        <tabBar @onChange="onChange"></tabBar>
    </div>
</template>

<script setup>
import tabBar from '@/components/tabBar.vue';
import router from '@/router';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

function onChange(index) {
    switch (index) {
        case 0:
            router.push("/")
            break;

        // case 1:
        //     router.push("/task")
        //     break;
        case 2:
            router.push("/task")
            break;

        case 3:
            router.push("/user")
            break;
    }
}

</script>

<style lang="scss" scoped></style>