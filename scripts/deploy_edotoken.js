// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function deployEDOToken(EDOTokenInstance) {
  const _edoTokenAddress = EDOTokenInstance.address;
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const EDOTokenFactory = await hre.ethers.getContractFactory("EDOToken");

  const _owner = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"; // test account 2

  const _signer = "0xeAB1e71AF80a159f6A03c6Ab4BEB52356f7d6dB4"; // Backend signer pubkey

  const TokenInstance = await EDOTokenFactory.deploy(_edoTokenAddress, _owner, _signer);

  await TokenInstance.deployed();

  console.log("EDO Token deployed to:", TokenInstance.address);
  return TokenInstance;
}


module.exports = deployEDOToken;