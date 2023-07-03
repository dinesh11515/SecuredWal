require("@nomicfoundation/hardhat-toolbox");
//dotenv
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ftm: {
      url: "https://fantom.blockpi.network/v1/rpc/public",
    },
  },
  etherscan: {
    apiKey: {
      opera: process.env.FTM,
    },
  },
};
