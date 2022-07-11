require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const infuraAPIKey = process.env.INFURA_API_KEY || '28b9e0dd83684fc683003d2d05d32270';
const rinkebyPK = process.env.RINKEBY_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  gasReporter: {
    currency: 'USD',
    gasPrice: 150
  },
  etherscan: {
    apiKey: "B6YE5AJ14F9U3RDDEY8YHXFSW3361JW4MR"
  },
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
        '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
        '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
        '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
        '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba'
      ]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infuraAPIKey}`,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infuraAPIKey}`,
      accounts: [
        rinkebyPK
      ],
    }
  },
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./build"
  },
  mocha: {
    timeout: 40000
  }
}