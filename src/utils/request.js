import axios from "axios";

import { userStoreHook } from "@/store/userStore.js"

import i18n from "@/language";

const request = axios.create({
    timeout: 60 * 1000,
    baseURL: import.meta.env.VITE_APP_BASE_API
});

request.interceptors.request.use(
    (config) => {
        const userStore = userStoreHook();
        let langMap = {
            "zh-cn": "zh_TW",
            "en-us": "en"
        }
        config.headers["lang"] = langMap[i18n.global.locale.value]
        if (userStore.token) {
            config.headers["Authorization"] = 'Bearer ' + userStore.token;
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

request.interceptors.response.use(
    (res) => {
        let status = res.data.code;
        let message = res.data.message || res.data.msg;
        if (status == 200) {
            return res.data;
        }
        else {
            return Promise.reject(message);
        }
    },
    (err) => {
        return Promise.reject(err);
    }
);

["get", "post"].forEach(item => {
    request[item] = (url, params = {}, options = {}) => {
        let argument = item == "get" ? "params" : "data";
        return request({
            url,
            method: item,
            [argument]: params,
            hraders: options.headers || {},
        })
    };
});

export default request;