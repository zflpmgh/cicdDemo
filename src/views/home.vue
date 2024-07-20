<template>
    <div class="page-box flex flex-col">
        <my-nav></my-nav>
        <div class="dog-box" @touchstart="onTouch($event)">
            <img src="@/assets/img/dog.png" style="width: 100%;height: 100%;" alt="">
        </div>
        <div class="flex justify-center items-center py-3" style="color: #fff;">
            <img src="@/assets/img/lightning.png" style="width: 34px;height: 34px;" alt="">
            <div class="flex items-baseline">
                <span style="font-size: 22px;">{{ userStore.userInfo.stamina }}/</span>
                <span style="font-size: 17px;">{{ userStore.userInfo.all_stamina }}</span>
            </div>

        </div>
        <div class="main flex flex-col flex-1 py-3 px-2">
            <div class="list flex justify-between items-center">
                <!-- <div class="flex flex-col justify-center items-center py-3">
                    <span style="color: #7379F6;">{{ t('单次产出') }}</span>
                    <div class="flex justify-center items-center mt-1">
                        <img src="@/assets/img/coin-icon.png" style="width: 26px;height: 26px;" alt="">
                        <span style="font-size: 20px;">+{{ userStore.userInfo.click_points }}</span>
                    </div>
                </div> -->

                <div class="flex flex-col justify-center items-center" style="height: 80px;">
                    <div v-if="userStore.userInfo.ai_auto_status == 0" @click="show = false">
                        <img src="@/assets/img/jiqi_off.png" style="width: 40px;height: auto;" alt="">
                        <div class="tips-btn">OFF</div>
                    </div>

                    <div v-else>
                        <img src="@/assets/img/jiqi_on.png" style="width: 40px;height: auto;" alt="">
                        <div class="tips-btn active">ON</div>
                    </div>
                </div>

                <div class="flex flex-col justify-center items-center ml-3" style="height: 80px;">
                    <span style="color: #FF9064;">{{ t('升级所需') }}</span>
                    <div class="flex justify-center items-center mt-1">
                        <span style="font-size: 20px;">{{ wUnit(userStore.userInfo.next_points) }}</span>
                    </div>
                </div>
                <div class="flex flex-col justify-center items-center ml-3" style="height: 80px;">
                    <span style="color: #5DF689;">{{ t('当前等级') }}</span>
                    <div class="flex justify-center items-center mt-1">
                        <span style="font-size: 20px;">Lv{{ userStore.userInfo.level }}</span>
                    </div>
                </div>
            </div>

            <div class="progress-bar">
                <div class="progress-bar-content" :style="{ 'width': `${percentage}%` }"></div>
            </div>
            <div class="flex justify-between items-center mt-1 text-gray" style="font-size: 13px;">
                <span>{{ t('全部') }} {{ userStore.userInfo.all_points }}</span>
                <span>{{ t('等级') }} {{ userStore.userInfo.level }}/10</span>
            </div>

            <div class="flex justify-center items-center mt-5">
                <img src="@/assets/img/coin-icon.png" style="width: 61px;height: 61px;" alt="">
                <span class="ml-2 text-white" style="font-size: 28px;">
                    {{ thousandth(userStore.userInfo.points + "") }}
                </span>
            </div>
        </div>

        <Transition name="fade" v-show="show">
            <div class="popup-box px-4 pt-5">
                <div class="text-right" @click="show = false">
                    <van-icon name="cross" color="#fff" size="22px" />
                </div>

                <div class="flex flex-col justify-center items-center">
                    <img src="@/assets/img/jiqi_on.png" style="width: 90px;" alt="">
                    <div style="font-size: 20px;font-weight: bold;" class="mt-4">AI Robot</div>
                    <div style="font-size: 15px;" class="mt-2">{{ t('开通可自动获取Miguel') }}</div>
                </div>

                <div class="btn" @click="openFun">
                    <van-loading size="24px" text-color="#fff" v-if="loading">{{ t('等待中') }}...</van-loading>
                    <span style="font-size: 17px;" v-else>{{ t('AI机器人价格', { price: aiPrice }) }}</span>
                </div>
            </div>
        </Transition>

        <div class="mask-box" v-if="show"></div>

        <div class="mask-box" v-if="show2"></div>

        <Transition name="fade2" v-show="show2">
            <div class="popup-box2 flex flex-col px-3">
                <!-- <div class="text-right" @click="show = false">
                    <van-icon name="cross" color="#fff" size="22px" />
                </div> -->

                <div class="pt-5 text-center" style="font-size: 16px;">{{ t('绑定推荐人') }}</div>

                <input v-model="spreadUserAddress" type="text" class="input" :placeholder="t('请输入推荐人地址')">

                <div class="btn2 mt-auto" @click="bindSpreadUser">{{ t('确定') }}</div>
            </div>
        </Transition>
    </div>
</template>

<script setup>

const throttle = (fn, delay = 1000) => {
    let timer = null;
    return function (...args) {
        const context = this;
        if (!timer) {
            fn.apply(context, args);
            timer = setTimeout(() => {
                timer = null;
            }, delay);
        }
    }
}

import { upDatePointApi, transactionApi } from "@/api/user";
import MyNav from "@/components/myNav.vue"
import useUserStore from "@/store/userStore";
let userStore = useUserStore();
import gasp from 'gsap';

import { useI18n } from 'vue-i18n'
const { t } = useI18n();

import { wUnit } from "@/utils/util"
import { configApi, bindSpreadUserApi } from "@/api/user";
import { nativeCoinTransfer } from "@/utils/webUtil";


let show = ref(false);
let show2 = ref(false);

let aiPrice = ref("");

let loading = ref(false);

let spreadUserAddress = ref("");

onMounted(async () => {
    await userStore.updateUserInfo();
    if (userStore.userInfo.agent_id == 0) {
        setTimeout(() => {
            show2.value = true;
        }, 600);
    }
})

onMounted(async () => {
    let { data: { ai_automatic_claim_price } } = await configApi();
    aiPrice.value = ai_automatic_claim_price;
})




/**
 * 进度条百分比
 */
let percentage = computed(() => {
    if (!userStore.userInfo.all_points || !userStore.userInfo.next_points) return 0;
    return Math.min(Math.max(0, parseFloat(((userStore.userInfo.all_points / userStore.userInfo.next_points) * 100).toFixed(2))), 100)
})




const onTouch = throttle(async function (e) {
    if (userStore.userInfo.ai_auto_status == 1) return;
    if (userStore.userInfo.stamina <= 0) return;
    let { pageX, pageY } = e.changedTouches[0];

    let text = document.createElement("span");
    document.body.appendChild(text);
    text.innerHTML = "+" + userStore.userInfo.click_points;
    text.className = "text";
    text.style.top = pageY + 'px';
    text.style.left = pageX + 'px';

    let tl = gasp.timeline({ defaults: { duration: 2 } });
    tl.to(".text", {
        y: -400, opacity: 0.5, onComplete() {
            document.body.removeChild(text);
            text = null;
        }
    });

    try {
        let { data } = await upDatePointApi();
        userStore.setUserInfo({
            ...userStore.userInfo,
            ...data
        })
    } catch (error) {
        showNotify({ type: 'danger', message: error });
    }
}, 200)

function thousandth(data) {
    if (!data) return "";
    return data.replace(/(?!^)(?=(\d{3})+$)/g, ',');
}

/**
 * 开通机器人
 */
async function openFun() {
    let chainId = await window.ethereum.request({ method: 'eth_chainId' })
    chainId = Number(chainId);
    let { data: { fibo_price, bnb_price, ai_automatic_claim_price } } = await configApi();

    let amount;
    if (chainId == 56) {
        amount = parseFloat((ai_automatic_claim_price / bnb_price).toFixed(8))
    }
    else {
        amount = parseFloat((ai_automatic_claim_price / fibo_price).toFixed(8))
    }

    try {
        loading.value = true;
        let { transactionHash } = await nativeCoinTransfer(amount);
        var params = {
            result: 1,
            tppay_type: 1,
            txID: transactionHash,
            amount,
            chain_id: chainId
        }
        await transactionApi(params);
        userStore.updateUserInfo();
        show.value = false;
    } catch (error) {
        console.error(error);
    }
    finally {
        loading.value = false
    }
}

async function bindSpreadUser() {
    if (!spreadUserAddress.value) return showToast(t('请输入推荐人地址'));

    try {
        let { message } = await bindSpreadUserApi({ address: spreadUserAddress.value });
        showNotify({ type: 'success', message: message })
        userStore.updateUserInfo();

        setTimeout(() => {
            show2.value = false;
        }, 500)

    } catch (error) {
        showNotify({ type: 'danger', message: error })
    }

}

</script>

<style lang="scss" scoped>
.dog-box {
    width: vw(600);
    height: vw(600);
    max-width: 310px;
    max-height: 310px;
    margin: 0 auto;
}

.page-box {
    height: 100vh;
}

.main {
    background: linear-gradient(to top, #232832, #0D0F13);
    border-radius: 24px 24px 0 0;
    position: relative;
    border-top: 4px solid rgb(240, 175, 5);
    box-shadow: 0px -20px 35px rgba(240, 175, 5, .3);
    padding-bottom: 120px;
}

.list>div {
    background-color: #262A2F;
    border-radius: 12px;
    flex: 1;
    color: #fff;
}

.progress-bar {
    margin-top: 20px;
    height: 20px;
    background-color: #262A2F;
    border-radius: 100px;
    overflow: hidden;

    .progress-bar-content {
        height: 100%;
        border-radius: 100px;
        background: linear-gradient(270deg, #CAA428 0%, #91600E 100%);
    }
}

.tips-btn {
    width: 42px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #808080;
    font-size: 14px;
    background-color: #F8F8F8;
    border-radius: 100px;
}

.tips-btn.active {
    background-color: #5DF689;
    color: #262A2F;
    font-weight: bold;
}

.popup-box {
    position: absolute;
    z-index: 100;
    left: 0;
    right: 0;
    bottom: 0;
    height: 300px;
    background: linear-gradient(to top, #232832, #0D0F13);
    border-radius: 24px 24px 0 0;
    border-top: 1px solid rgb(240, 175, 5);
    // box-shadow: 0px -10px 20px rgba(240, 175, 5, .5);
    transform: translate3d(0, 0, 0);
    opacity: 1;
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

.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
}

.btn {
    background: linear-gradient(180deg, #50C85F 0%, #287E31 100%);
    height: 58px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    margin-top: 30px;
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
</style>

<style>
body .text {
    color: #fff;
    font-size: 22px;
    font-weight: bold;
    position: fixed;
    z-index: 2;
    opacity: 1;
}
</style>