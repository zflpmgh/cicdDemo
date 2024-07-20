import { configApi } from "@/api/user";
import Web3 from "web3"

/**
 * 原生代币转账
 */
export const nativeCoinTransfer = (count) => {
    const web3 = new Web3(window.ethereum);
    return new Promise(async (resolve, reject) => {
        const fromAddress = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];

        let { data: { recharge_address } } = await configApi();

        // 构建交易对象
        const txObject = {
            from: fromAddress,
            to: recharge_address,
            value: web3.utils.toWei(count + "", 'ether'),
            gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
            gasLimit: web3.utils.toHex(200000),
        };

        // 发送交易
        web3.eth.sendTransaction(txObject)
            .on('transactionHash', hash => {
            })
            .on('receipt', receipt => {
                resolve(receipt)
            })
            .on('error', (err) => {
                reject(err)
            });
    })
}