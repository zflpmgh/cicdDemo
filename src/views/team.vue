<template>
    <div class="page-box flex flex-col px-3 text-white">
        <head-bar />
        <div class="flex flex-col justify-center items-center mt-4">
            <span style="font-size: 28px;">{{ t('我的好友们') }}</span>
            <span class="text-gray mt-1" style="font-size: 14px;">{{ t('您将通过邀请获得奖励') }}</span>
            <div class="flex flex-col justify-center items-center box">
                <span>{{ t('我的好友总数') }}</span>
                <div style="font-size: 22px;">{{ teamTotal }}</div>
            </div>
        </div>
        <div style="font-size: 15px;font-weight: bold;margin-bottom: 15px;margin-top: 30px;">{{ t('好友列表') }}</div>
        <div class="main">

            <my-list @lower="onLower">
                <div class="list">
                    <div v-for="item in list" class="item flex items-center bg-theme">
                        <img :src="item.avatar_url" style="width: 40px;height: 40px;" alt="">
                        <div class="ml-4">
                            <div>{{ item.nickname }}</div>
                            <div>{{ addressFilter(item.name) }}</div>
                        </div>

                        <div class="ml-auto text-center">
                            <div style="color: #E3B82C;">{{ t('等级') }}</div>
                            <div style="font-size: 17px;">{{ item.level }}</div>
                        </div>

                        <div class="ml-4" v-if="item.is_valid==1">
                            <div style="font-size: 17px;color: #E3B82C;">+{{ item.invite_reward }}</div>
                        </div>
                    </div>
                </div>
            </my-list>
        </div>
    </div>
</template>

<script setup>
import MyList from '@/components/myList.vue';
import HeadBar from '@/components/headBar.vue';

import { useI18n } from 'vue-i18n'
const { t } = useI18n();

import usePaging from "@/hooks/paging"
const [pagingData, setList] = usePaging();


import { addressFilter } from "@/utils/util"

import { getTeamApi } from "@/api/user"


const list = ref([]);

/**
 * 好友总数
 */
let teamTotal = ref(0);

function onLower() {
    getList({ first: false, loading: false });
};

onMounted(() => {
    getList();
})

async function getList(options = {}) {
    let option = {
        loading: true,
        first: true,
        ...options,
    }
    if (option.first) {
        pagingData.value.page = 1;
        pagingData.value.loadState = 0;
    }
    if (pagingData.value.lockLoad || pagingData.value.loadState == 2) return;
    pagingData.value.lockLoad = true;
    let params = {
        page: pagingData.value.page,
        limit: pagingData.value.limit,
    }
    try {
        let { data: { data: _list, total} } = await getTeamApi(params, option);
        teamTotal.value = total;
        setList(list, _list, option.first)
    } catch (e) {

    } finally {
        pagingData.value.lockLoad = false;
    }
}

</script>

<style lang="scss" scoped>
.page-box {
    height: 100vh;
    padding-bottom: 20px;
}

.box {
    width: 100%;
    height: 66px;
    border-radius: 8px;
    background-color: #3693A7;
    font-size: 16px;
    line-height: 1.6;
    margin-top: 12px;
}

.main {
    flex: 1;
    height: 0px;
}

.item {
    padding: 10px;
    border-radius: 12px;
}

.item+.item {
    margin-top: 12px;
}
</style>