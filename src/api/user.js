import request from "@/utils/request";

/**
 * 登录
 */
export const loginApi = (params) => request.post("/auth/login", params);

/**
 * 获取用户信息
 */
export const getUserInfoApi = () => request.get("/user/me");


/**
 * 编辑用户信息
 */
export const editUserApi = (params) => request.post("/user/edit", params);


/**
 * 点击更新point
 */
export const upDatePointApi = (params) => request.post("/point/click", params);


/**
 * 好友列表
 */
export const getTeamApi = (params) => request.get("/user/my/share", params);


/**
 * 签到
 */
export const signApi = () => request.post("/point/sign");


/**
 * 全局配置
 */
export const configApi = () => request.get("/tool/config/qVdicihygH");


/**
 * 获取头像列表
 */
export const getAvatarListApi = () => request.get("/tool/avatar/list");

/**
 * 任务列表
 */
export const getTaskListApi = () => request.get("/task/list");

/**
 * 完成任务
 */
export const handlerTaskApi = (params) => request.post("/task/click", params);

/**
 * 刷新签到数据
 */
export const refurSignApi = () => request.get("/point/refresh/sign");


/**
 * 交易成功回调
 */
export const transactionApi = (params) => request.get("tp_pay/call_back", params);

/**
 * 我的钱包
 */
export const walletApi = () => request.get("funds/account");


/**
 * 绑定推荐人
 */
export const bindSpreadUserApi = (params) => request.post("/user/bind/agent", params);

/**
 * 获取图形验证码
 */
export const captchaApi = () => request.get("/tool/captcha");

/**
 * 判断用户是否注册
 */
export const accountIsRegisetrApi = (params) => request.get("/tool/register_or_not", params);