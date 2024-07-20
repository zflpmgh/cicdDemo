function isJsonStr(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
}

const Cache = {
    has(key) {
        return !!window.localStorage.getItem(key);
    },
    get(key) {
        let storage = window.localStorage.getItem(key);
        if (!storage) return null;
        if (!isJsonStr(storage)) return null;
        storage = JSON.parse(window.localStorage.getItem(key));
        if (!storage.expires || Date.now() <= storage.expires) {
            return storage.value;
        } else {
            window.localStorage.removeItem(key);
            return null;
        }
    },

    /**
     * expires表示过期时间，单位为s，若为0，则表示永不过期
     */
    set(key, value, expires = 0) {
        if (expires !== 0) {
            expires = Date.now() + (expires * 1000);
            return window.localStorage.setItem(key, JSON.stringify({ value, expires }))
        }
        return window.localStorage.setItem(key, JSON.stringify({ value }))
    },

    remove(key) {
        return window.localStorage.removeItem(key);
    },
}

export default Cache;