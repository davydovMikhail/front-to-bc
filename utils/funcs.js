import BigNumber from "bignumber.js";
var Web3 = require('web3');
import Web3Modal from 'web3modal';
// import config from './wallet';

BigNumber.config({ EXPONENTIAL_AT: 60 });

let userAddress
let web3Wallet
let web3Guest
let web3Modal
let web3

// export const getUserAddress = async () => {
//   try {
//     const { ethereum } = window; // ethereum - metamask
//     web3Wallet = new Web3(ethereum); // init web3
//     userAddress = await web3Wallet.eth.getCoinbase(); // получить адрес пользователя
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// }

export const connectWallet = async () => {
    try {
      // const { providerOptions } = config;
      web3Modal = new Web3Modal({
        // providerOptions, // required
      });
      const provider = await web3Modal.connect();
      await provider.enable();
      web3 = new Web3(provider);
      userAddress = await web3.eth.getCoinbase();
      // const { ethereum } = window; // ethereum - metamask
      // if (!ethereum) {
      //   console.log('metamask is not install')
      //   return false;
      // }
      // web3Wallet = new Web3(ethereum); // init web3
      // if (await web3Wallet.eth.getCoinbase() === null) { // проверяем подключен ли metamask
      //   await ethereum.enable(); // подключить metamask
      // }
      // userAddress = await web3Wallet.eth.getCoinbase(); // получить адрес пользователя
      // let chainId = await web3Wallet.eth.net.getId(); // запись сети
      // if (+chainId !== 4) {
      //   console.log('current project work on rinkeby network')
      //   return false;
      // }  
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
}

export const connectNode = () => {
    try {
      let bscUrl
      if (process.env.IS_MAINNET === 'true') {
        bscUrl = 'https://rpc.ankr.com/eth'
      } else {
        // bscUrl = 'https://rpc.ankr.com/eth_rinkeby'
        bscUrl = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
      }
      const provider = new Web3.providers.HttpProvider(bscUrl)
      web3Guest = new Web3(provider)
      return true
    } catch (e) {
      return false
    }
  }

export const fetchContractData = async (method, abi, address, params) => {
    try {
      const contract = new web3Guest.eth.Contract(abi, address)
      return await contract.methods[method].apply(this, params).call()
    } catch (e) {
      console.log(e)
      return ''
    }
  } 

export const getBalance = async (abi, token) => {
  const decimals = await fetchContractData('decimals', abi, token)
  let balance = await fetchContractData(
    'balanceOf',
    abi,
    token,
    [userAddress]
  )
  balance = new BigNumber(balance).shiftedBy(-decimals).toString()
  return balance
}

export const getAllowance = async (token, recipient, abi, decimals) => {
  let allowance = await fetchContractData('allowance', abi, token, [userAddress, recipient])
  allowance = new BigNumber(allowance).shiftedBy(-decimals).toString();
  return allowance
}

export const approve = async (token, recipient, amount, abi, decimals) => {
  try {
      const instanceContract = await new web3Wallet.eth.Contract(abi, token);
      const total = new BigNumber(amount).shiftedBy(+decimals).toString();
      await instanceContract.methods.approve(recipient, total).send({ from: userAddress });
      return true;
  } catch (err) {
      console.log(err);
      return false;
  }
};

export const transfer = async (token, recipient, amount, abi, decimals) => {
  try {
      const instanceContract = await new web3.eth.Contract(abi, token);
      const total = new BigNumber(amount).shiftedBy(+decimals).toString();
      await instanceContract.methods.transfer(recipient, total).send({ from: userAddress });
      return true;
  } catch (err) {
      console.log(err);
      return false;
  }
};
