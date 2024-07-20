import { getUserInfoApi } from "@/api/user";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const userStore = defineStore("user", () => {
    /** state */
    let token = ref("");
    const userInfo = ref({})

    /** action */
    function setToken(data) {
        token.value = data;
    }

    function setUserInfo(data) {
        userInfo.value = data;
    }

    async function updateUserInfo() {
        let { data } = await getUserInfoApi();
        userInfo.value = data;
    }


    /** getters */
    let isLogin = computed(() => !!token.value)


    return { token, userInfo, isLogin, setToken, updateUserInfo, setUserInfo };
});

export default userStore


/**
 * 暴露在其他js文件使用store的方法
 */
export function userStoreHook() {
    return userStore()
}