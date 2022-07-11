// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const deployEDOToken = require('./deploy_edotoken');
const deployBreedingManager = require('./deploy_breedingmanager');

let vSamuraiInstance

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const vSamuraiFactory = await hre.ethers.getContractFactory("vSamurai");

  const baseURL = 'ipfs://QmXCEv3rqNuaUDExMXLZNrkD41ZBYKsNjtH6SvBMBKH9zB/';
  const _maxPublicBatchSize = 1;
  const _maxBatchSize = 5;
  const _developerAddress = "0x9D7a3F970Bbc7aB9C8537dc9637051b824A9eD0C";
  const _developerFee = 10;

  /**
   * 0xa5409ec958c83c3f309868babaca7c86dcb077c1 // Mainnet
   * 0xf57b2c51ded3a29e6891aba85459d600256cf317 // Rinkeby
   */
  const _proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317"; // Change for rinkeby or production
  const _owner = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"; // test account 2

  const _signer = "0xeAB1e71AF80a159f6A03c6Ab4BEB52356f7d6dB4"; // Backend signer pubkey

  vSamuraiInstance = await vSamuraiFactory.deploy(baseURL, _maxPublicBatchSize, _maxBatchSize, _developerAddress, _developerFee, _proxyRegistryAddress, _owner, _signer);

  await vSamuraiInstance.deployed();

  console.log("vSamurai deployed to:", vSamuraiInstance.address);
  return vSamuraiInstance;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(deployEDOToken)
  .then(deployBreedingManager)
  .then((BreedingManagerInstance) => {
    return vSamuraiInstance.setBreedingManager(BreedingManagerInstance.address)
  })
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

