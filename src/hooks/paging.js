export default () => {
    let pagingData = ref({
        page: 1,
        limit: 20,
        loadState: 0,
        count: 0,
        loadText: "",
        noData: false,
        lockLoad: false
    })

    watch(() => pagingData.value.loadState, (val) => {
        if (val == 0) {
            pagingData.value.loadText = ""
        }
        if (val == 1) {
            pagingData.value.loadText = "加载中..."
        }
        if (val == 2) {
            pagingData.value.loadText = "已加载全部~"
        }
        if (val == 3) {
            // 第一页无数据
        }
    })

    function setList(target, list, first) {
        let total = list.length;
        target.value = first ? list : target.value.concat(list);
        if (total == pagingData.value.limit) {
            // 可能有下一页
            pagingData.value.loadState = 1;
            pagingData.value.noData = false;
            pagingData.value.page++;
        } else if (total < pagingData.value.limit) {
            if (first && total == 0) {
                // 无数据
                pagingData.value.noData = true;
                pagingData.value.loadState = 3;
            } else {
                // 最后一页
                pagingData.value.loadState = 2
                pagingData.value.noData = false;
            }
        }
    }

    return [pagingData, setList]
}