import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",

  // defaultNetwork: "goerli",
  networks: {
    hardhat: {
      forking: {
        enabled: true,
        //@ts-ignore
        url: process.env.MAINNET_RPC,
      },
      gas: 1800000,
    },
    goerli: {
      url: process.env.GOERLI_RPC,
      //@ts-ignore
      accounts: [process.env.PRIVATE_KEY1, process.env.PRIVATE_KEY2],
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC,
      //@ts-ignore
      accounts: [process.env.PRIVATE_KEY1, process.env.PRIVATE_KEY2],
    },
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
