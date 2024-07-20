<template>
  <div class="app-container">
    <template v-if="isSign || route.path == `/setLang`">
      <router-view></router-view>
    </template>

    <template v-else>
      <div class="sign-box flex flex-col items-center">
        <div style="width: 100%;margin-bottom: 50px;">
          <my-nav></my-nav>
        </div>

        <img src="@/assets/img/logo2.png" class="welcome-img" />
        <div class="sign-btn" @click="verification">{{ t('签名') }}</div>
      </div>

      <Transition name="fade2" v-show="show">
        <div class="popup-box2 flex flex-col items-center pt-5 px-3">

          <div class="flex items-center">
            <img :src="captchaSrc" style="width: 160px;height: auto;" alt="">
            <div style="font-size: 16px;" class="ml-2" @click="cutCaptcha">换一个</div>
          </div>


          <input v-model="captcha" type="text" class="input" :placeholder="t('请输入图形验证码')">

          <div class="btn2 mt-auto" @click="commit">{{ t('确定') }}</div>
        </div>
      </Transition>
      <div class="mask-box" v-if="show"></div>
    </template>
  </div>

</template>

<script setup>
import Web3 from "web3";
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

import MyNav from "@/components/myNav.vue"

import useUserStore from "@/store/userStore";
let userStore = useUserStore();

const route = useRoute();

import { loopTimer } from "@/utils/util";

const timer = new loopTimer(() => {
  userStore.updateUserInfo();
}, 60 * 1000)

import { captchaApi, loginApi, accountIsRegisetrApi } from "@/api/user"


let isSign = ref(false);

let captchaSrc = ref("");

let show = ref(false);
onMounted(async () => {

  window.addEventListener("load", () => {
    if (!window.ethereum) return showNotify({ type: 'danger', message: t('请在钱包中使用') });
  })
})

onUnmounted(() => {
  timer.stop();
})


let signParams = ref({
  account: "",
  captcha: "",
  key: ""
})

let captcha = ref("");

async function verification() {
  if (!window.ethereum) return showNotify({ type: 'danger', message: t('请在钱包中使用') });
  const web3 = new Web3(window.ethereum);
  let account = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];
  let { data: { is_reg } } = await accountIsRegisetrApi({ address: account })
  if (is_reg) {
    sign({
      account,
      captcha: "",
      key: ""
    })
  }
  else {
    let { data: { captcha, key } } = await captchaApi();
    captchaSrc.value = captcha;
    signParams.value = {
      account,
      captcha: "",
      key
    }
    show.value = true;
  }
}

function commit() {
  let params = {
    ...signParams.value,
    captcha: captcha.value,
  }

  sign(params);
}

async function sign(options) {
  const web3 = new Web3(window.ethereum);
  try {
    let chainId = await window.ethereum.request({ method: 'eth_chainId' })
    chainId = Number(chainId);
    if (chainId != 56 && chainId != 12306) {
      return showNotify({ type: 'danger', message: t('Miguel Beagle仅支持BSC、FIBO链') });
    }

    // 请求签名
    let sign = await web3.eth.personal.sign("Miguel Beagle", options.account);

    // 登录
    let params = {
      address: options.account,
      sign,
      recom_code: route.query.recom_code,
      captcha: options.captcha,
      key: options.key,
    }
    let { data: { token } } = await loginApi(params);
    userStore.setToken(token);
    userStore.updateUserInfo();
    show.value = false;
    isSign.value = true;
    timer.stop();
    timer.start();
  } catch (error) {
    console.log(error);
    showNotify({ type: 'danger', message: error });
  }
}

async function cutCaptcha() {
  let { data: { captcha,key } } = await captchaApi();
  captchaSrc.value = captcha;
  signParams.value.key = key;
}
</script>


<style lang="scss">
@import "./assets/common.scss";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

.app-container {
  max-width: 750px;
  min-height: 100vh;
  background: linear-gradient(180deg, #1B1F24 0%, #0F1115 100%);
  margin: 0 auto;
}

html,
body {
  padding: 0;
  margin: 0;
  min-height: 100vh;
}

body * {
  box-sizing: border-box;
  font-size: 14px;
  color: #fff;
}

input {
  background-color: transparent;
  border: none !important;
  outline: none !important;
}


.sign-box {
  height: 100vh;

  .sign-btn {
    width: 160px;
    height: 54px;
    background: linear-gradient(90deg, #8E82DB 0%, #DE8381 51%, #F2B67D 100%);
    box-shadow: 0px 4px 20px 2px rgba(0, 0, 0, 0.25);
    border-radius: 100px;
    color: #fff;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
  }
}

.welcome-img {
  width: vw(750);
  height: vw(854);
  max-width: calc(375px * 1.25);
  max-height: calc(427px * 1.25);
}

.popup-box2 {
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 330px;
  height: 230px;
  margin: auto;
  background: #232832;
  border-radius: 18px;
  transform: scale(1);
  opacity: 1;

  .input {
    height: 44px;
    width: 100%;
    border: 1px solid #808080 !important;
    padding: 0 10px;
    border-radius: 8px;
    margin-top: 20px
  }

  .btn2 {
    width: 100%;
    background: linear-gradient(180deg, #50C85F 0%, #287E31 100%);
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    margin-bottom: 20px;
  }
}

.fade2-enter-active,
.fade2-leave-active {
  transition: all 0.2s ease;
}

.fade2-enter-from,
.fade2-leave-to {
  transform: scale(0);
  opacity: 0;
}

.mask-box {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.5);
}

</style>
