
// 简单同步轮询
export const delay = (time = 10 * 1000, fn) => {
  if (!time) time = 5 * 1000;
  return new Promise((resovle, reject) => {
    let timer = null;
    var start = Date.now();

    function fun() {
      if (fn()) {
        timer && clearTimeout(timer);
        resovle();
      } else {
        if (Date.now() - start < time) {
          timer = setTimeout(fun, 200)
        } else {
          timer && clearTimeout(timer);
          reject();
        }
      }
    }
    fun();
  })
}


export const copyText = (data) => {
  return new Promise((resolve) => {
    const textarea = document.createElement("textarea");
    data = data.toString();
    textarea.value = data;
    textarea.readOnly = true;
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, data.length);
    document.execCommand("copy");
    textarea.remove();
    resolve(data);
  });
}

/**
 * 地址简写
 */
export const addressFilter = (address) => {
  if (!address) return "";
  return address.replace(/^(\w{8})\w+(\w{8})$/, "$1....$2")
}

/**
 * 定时器
 */
export const loopTimer = class {
  timeoutId = null
  constructor(fn, timer = 1000, maxAwaitTime = 0) {
    this.startTime = Date.now();
    this.fn = fn;
    this.timer = timer;
    this.maxAwaitTime = maxAwaitTime;
  }
  start() {
    let that = this;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      if (that.maxAwaitTime > 0) {
        if (Date.now() - that.startTime >= that.maxAwaitTime) {
          that.stop();
        } else {
          that.fn();
          that.start();
        }
      } else {
        that.fn();
        that.start();
      }
    }, this.timer);
  }

  againStart() {
    this.startTime = Date.now();
    this.start();
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

/**
 * 千单位
 */
export const kUnit = (data) => {
  data = Number(data);
  return data >= 1000 ? parseFloat((data / 1000).toFixed(1)) + "k" : data;
}

/**
 * 万单位
 */
export const wUnit = (data) => {
  data = Number(data);
  return data >= 10000 ? parseFloat((data / 10000).toFixed(1)) + "w" : data;
}


/**
 * 延时函数
 */
export const myTimeout = (millisecond) => new Promise(resolve => setTimeout(resolve, millisecond));