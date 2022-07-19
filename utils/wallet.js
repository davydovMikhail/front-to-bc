// import WalletConnectProvider from '@walletconnect/web3-provider';

// const { infura } = process.env;
// const { portisId } = process.env;
// const { formaticKey } = process.env;

const providerOptions = {
  // fortmatic: {
  //   package: Fortmatic, // required
  //   options: {
  //     key: formaticKey, // required
  //   },
  // },
  // walletconnect: {
  //   package: WalletConnectProvider, // required
  //   options: {
  //     rpc: {
  //       1: 'https://rpc.ankr.com/eth/',
  //       4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  //       56: 'https://bsc-dataseed.binance.org/',
  //       97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  //       250: 'https://rpc.ankr.com/fantom',
  //       4002: 'https://rpc.testnet.fantom.network/',
  //       43114: 'https://rpc.ankr.com/avalanche/',
  //       43113: 'https://api.avax-test.network/ext/bc/C/rpc/',
  //     },
  //   },
  // },
  // portis: {
  //   package: Portis, // required
  //   options: {
  //     id: portisId, // required
  //   },
  // },
};

const config = {
  // infura,
  // fundraiseAddress,
  // fundraiseAddressBsc,
  // fundraiseAddressFantom,
  // fundraiseAddressAvax,
  providerOptions
};

export default config;
