<template>
    <div class="page-box flex flex-col">
        <head-bar :title="t('设置')" />

        <div class="mt-5 px-4">
            <div class="item flex items-center justify-between" @click="show = true">
                <span>{{ t('头像') }}</span>
                <div class="flex items-center">
                    <img :src="avatar" style="width: 40px;height: 40px;" alt="">
                    <img src="@/assets/img/right-icon.png" class="ml-2" style="width: 17px;height: auto;" alt="">
                </div>
            </div>

            <div class="item flex items-center justify-between">
                <span>{{ t('昵称') }}</span>
                <div class="flex items-center">
                    <input type="text" v-model="nickname" class="text-right" :placeholder="t('请输入昵称')" />
                    <img src="@/assets/img/right-icon.png" class="ml-2" style="width: 17px;height: auto;" alt="">
                </div>
            </div>
        </div>

        <div class="px-4 mt-auto">
            <div class="btn flex justify-center items-center" @click="commit">{{ t('确定') }}</div>
        </div>

        <Transition name="fade" v-show="show">
            <div class="popup-box px-8 pt-5">
                <div style="font-size: 16px;font-weight: bold;" class="text-center">{{ t('请选择您的头像') }}</div>
                <div class="flex justify-between mt-6">
                    <div v-for="(item, index) in avatarList" class="avatar_item"
                        :class="{ 'active': activeIndex == index }" @click="pickAvatar(item)">
                        <img :src="item.url" style="width: 60px;height: 60px;" alt="">
                    </div>
                </div>
            </div>
        </Transition>
        <div class="popup-box-mask" v-if="show" @click="show = false"></div>
    </div>
</template>

<script setup>
import HeadBar from '@/components/headBar.vue';

import { useI18n } from 'vue-i18n'
const { t } = useI18n();

import useUserStore from "@/store/userStore";
let userStore = useUserStore();

import { getAvatarListApi, editUserApi } from "@/api/user"

let avatar = ref(userStore.userInfo.avatar_url);
let nickname = ref(userStore.userInfo.nickname);

let show = ref(false)

let avatarList = ref([])

let activeIndex = ref(-1)

let avatarName = ref(userStore.userInfo.avatar);

onMounted(async () => {
    let { data } = await getAvatarListApi();
    avatarList.value = data;
})

function pickAvatar(item) {
    avatar.value = item.url;
    avatarName.value = item.name;

    setTimeout(() => {
        show.value = false;
    }, 200);
}

async function commit() {
    try {
        let params = {
            nickname: nickname.value,
            avatar: avatarName.value
        }
        let { message } = await editUserApi(params)
        showNotify({ type: 'success', message: message })
        userStore.updateUserInfo();
    } catch (error) {
        showNotify({ type: 'danger', message: error })
    }
}

</script>

<style lang="scss" scoped>
.page-box {
    height: 100vh;
    padding-bottom: 25px;
    position: relative;
    overflow: hidden;
}

.item {
    padding: 12px 10px;
    background-color: $theme;
    border-radius: 6px;
}

.item+.item {
    margin-top: 15px;
}

.btn {
    background-color: #3693A7;
    color: #fff;
    border-radius: 10px;
    height: 54px;
}

.popup-box {
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    bottom: 0;
    height: 200px;
    background: linear-gradient(to top, #232832, #0D0F13);
    border-radius: 24px 24px 0 0;
    border-top: 1px solid rgb(240, 175, 5);
    box-shadow: 0px -10px 20px rgba(240, 175, 5, .5);
    transform: translate3d(0, 0, 0);
    opacity: 1;
}

.popup-box-mask {
    position: fixed;
    z-index: 2;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
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
</style>