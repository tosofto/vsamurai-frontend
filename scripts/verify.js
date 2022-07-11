const hre = require("hardhat");
const contractAddress = "0x0b95b4f29d10f7a676f8c38c7c0692b29a396d1d";
(async () => {


  const baseURL = 'https://vsamurai-nft.wn.r.appspot.com/api/metadata/';
  const _maxPublicBatchSize = 1;
  const _maxBatchSize = 5;
  const _developerAddress = "0x9D7a3F970Bbc7aB9C8537dc9637051b824A9eD0C";
  const _developerFee = 10;
  const _proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1"; // PROD
  const _owner = "0x448Ce47d94fe8cb5130cD30Fe31F78355FD71598"; // 

  const _signer = "0xeAB1e71AF80a159f6A03c6Ab4BEB52356f7d6dB4"; // Backend signer pubkey

  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [

      baseURL, _maxPublicBatchSize, _maxBatchSize, _developerAddress, _developerFee, _proxyRegistryAddress, _owner, _signer

    ],
  });
})()
