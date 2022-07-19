import BigNumber from "bignumber.js";
var Web3 = require('web3');
BigNumber.config({ EXPONENTIAL_AT: 60 });

let userAddress
let web3Wallet
let web3Guest

export const getUserAddress = async () => {
  try {
    const { ethereum } = window; // ethereum - metamask
    
    web3Wallet = new Web3(ethereum); // init web3
   
    userAddress = await web3Wallet.eth.getCoinbase(); // получить адрес пользователя

  } catch (err) {
    console.log(err);
    return false;
  }
}

export const connectWallet = async () => {

    try {
      const { ethereum } = window; // ethereum - metamask
      if (!ethereum) {
        console.log('metamask is not install')
        return false;
      }
      web3Wallet = new Web3(ethereum); // init web3
      if (await web3Wallet.eth.getCoinbase() === null) { // проверяем подключен ли metamask
        await ethereum.enable(); // подключить metamask
      }
      userAddress = await web3Wallet.eth.getCoinbase(); // получить адрес пользователя
      let chainId = await web3Wallet.eth.net.getId(); // запись сети
      if (+chainId !== 4) {
        console.log('current project work on rinkeby network')
        return false;
      }  
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
        bscUrl = 'https://rpc.ankr.com/eth_rinkeby'
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

export const sendTransactionContract = async (method, abi, address, params) => {
    try {
      const contract = new web3Guest.eth.Contract(abi, address)
      return await contract.methods[method].apply(this, params).send({ from: userAddress })
    } catch (e) {
      console.log(e)
      return ''
    }
  }

export const getInstance = async (abi, address) => {
  try {
    return new web3Guest.eth.Contract(abi, address)
  } catch (e) {
    console.log(e);
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

export const approve = async (token, recipient, amount, abi, decimals) => {
  try {
    console.log(userAddress);
      const instanceContract = await new web3Guest.eth.Contract(abi, token)
      console.log('instanceContract ', instanceContract );
      const total = new BigNumber(amount).shiftedBy(+decimals).toString();
      console.log(recipient, total);
      await instanceContract.methods.approve(recipient, total).send({ from: userAddress });




      // await sendTransactionContract('approve', abi, token, [recipient, total])
      // console.log('approve');
      // const { ethereum } = window;
      // web3Wallet = new Web3(ethereum);
      // await ethereum.enable();

      // web4 = new Web4();
      // await web4.setProvider(ethereum, userAddress);

      // const absErc20 = web4.getContractAbstraction(abi);
      // const inst = await absErc20.getInstance(token);
      // const total = new BigNumber(amount).shiftedBy(+decimals).toString();
      // await inst.approve(recipient, total);
      return true;
  } catch (err) {
      console.log(err);
      return false;
  }
};

export const getAllowance = async (token, recipient, abi, decimals) => {
  let allowance = await fetchContractData('allowance', abi, token, [userAddress, recipient])
  allowance = new BigNumber(allowance).shiftedBy(-decimals).toString();
  return allowance
}

export const transfer = async (token, recipient, amount, abi, decimals) => {
  try {
      const total = new BigNumber(amount).shiftedBy(+decimals).toString();
      await sendTransactionContract('transfer', abi, token, [recipient, total])
      // const { ethereum } = window;
      // web3Wallet = new Web3(ethereum);
      // await ethereum.enable();

      // web4 = new Web4();
      // await web4.setProvider(ethereum, userAddress);

      // const absErc20 = web4.getContractAbstraction(abi);
      // const inst = await absErc20.getInstance(token);
      // const total = new BigNumber(amount).shiftedBy(+decimals).toString();
      // await inst.transfer(recipient, total);
      return true;
  } catch (err) {
      console.log(err);
      return false;
  }
};
