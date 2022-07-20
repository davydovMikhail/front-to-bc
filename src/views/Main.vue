<template>
  <div class="main">
    <div class="connect">
      <button class="connect__button" @click="handleConnectWallet">connect wallet</button>
    </div>
    <h2>Amount</h2>
    <div class="amount">
        <input class="amount__input amount__input_small" type="text" placeholder="Amount" v-model="amount">
        <select class="amount__select" v-model="currentToken"  >
          <option  :value="currentToken" v-if="!currentToken.decimals">Choose valut</option>
          <option v-for="symbol in informationAboutTokens" :key="symbol.symbol" :value="symbol">{{symbol.symbol}}</option>
        </select>
    </div>
    <h2>Address (recipient)</h2>
    <div class="recipient">
        <input class="amount__input amount__input_big" type="text" placeholder="Addres" v-model="recipient">
    </div>
    <h3>Your balance: {{currentToken.bal | filterBalance }}  {{currentToken.symbol }}</h3>
    <h3>Your allowance: {{allowance | filterBalance}}</h3>
    <div class="buttons" >
        <button class="connect__button"  @click="handleGetAllowance">Get allowance</button>
        <button class="connect__button" @click="handleApprove">Approve</button>
        <button class="connect__button"  @click="handleTransfer">Transfer</button>
    </div>
  </div>
</template>

<script>
import { connectWallet,
 fetchContractData, 
 connectNode, 
 getBalance, 
//  getUserAddress,
 approve,
 getAllowance,
 transfer
  } from '../../utils/funcs'
import { ERC20 as ERC20Abi } from '../../utils/abi'



export default {
  name: 'Main',
  data() {
    return {
      tokens: [
        '0x4b107a23361770534bd1839171bbf4b0eb56485c',
        '0xc13da4146d381c7032ca1ed6050024b4e324f4ef',
        '0x8d0c36c8842d1dc9e49fbd31b81623c1902b7819',
        '0xa364f66f40b8117bbdb772c13ca6a3d36fe95b13',
        '0x9eB02B48372d2B3335CE78362a65Ab6B5863Ed25'
      ],     
      currentToken: {
        bal: "-",
        decimals: "",
        symbol: "Select currency"
      },
      informationAboutTokens: [],
      recipient: "",
      amount: "",
      allowance: "-"
    }
  },
  created() {
    this.initWallet()
  },
  filters: {
    filterBalance(value) {
      if(value === "NaN") {
        return "connect wallet"
      } else { return value }
    }
  },
  watch: {
    currentToken() {
      this.allowance = "-"
    }
  },
  methods: {
    async initWallet() {
      await connectNode()
      // await getUserAddress()
      let aboutTokens = []
      this.tokens.forEach(async function(token) {
          let symbol = await fetchContractData('symbol', ERC20Abi, token)
          let decimals = await fetchContractData('decimals', ERC20Abi, token)
          let bal = await getBalance(ERC20Abi, token)
          let obj = {
            symbol,
            decimals,
            bal,
            token
          }
          aboutTokens.push(obj)
      });
      this.informationAboutTokens = aboutTokens
    },
    async handleConnectWallet() {
      await connectWallet()
      this.initWallet()
    },
    handleApprove() {
      if(!this.currentToken.decimals) {
        this.$vToastify.info("Select token")
      } else if(!this.amount) {
        this.$vToastify.info("Fill in the field with the amount")
      } else if(!this.recipient) {
        this.$vToastify.info("Fill in the field with the recipient")
      } else {
        console.log(ERC20Abi);
        approve(this.currentToken.token, this.recipient, this.amount, ERC20Abi, this.currentToken.decimals)
      }
    },
    handleGetAllowance() {
      if(!this.currentToken.decimals) {
        this.$vToastify.info("Select token")
      } else if(!this.recipient) {
        this.$vToastify.info("Fill in the field with the recipient")
      } else {
        getAllowance(this.currentToken.token, this.recipient, ERC20Abi, this.currentToken.decimals).then((result) => {this.allowance = result})
      }
      
    },
    handleTransfer() {
      if(!this.currentToken.decimals) {
        this.$vToastify.info("Select token")
      } else if(!this.amount) {
        this.$vToastify.info("Fill in the field with the amount")
      } else if(!this.recipient) {
        this.$vToastify.info("Fill in the field with the recipient")
      } else {
        transfer(this.currentToken.token, this.recipient, this.amount, ERC20Abi, this.currentToken.decimals)
      }
    }
  },
  
}
</script>
