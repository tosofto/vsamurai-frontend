const hre = require("hardhat");
const contractAddress = "0x59349706cd07469ba353efc5f1ace17a2762e8d7";
(async () => {

  const _vSamurai = "0x0b95b4f29d10f7a676f8c38c7c0692b29a396d1d";
  const _owner = "0x448Ce47d94fe8cb5130cD30Fe31F78355FD71598"; // 

  const _signer = "0xeAB1e71AF80a159f6A03c6Ab4BEB52356f7d6dB4"; // Backend signer pubkey

  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [
      _vSamurai,
      _owner,
      _signer
    ],
  });
})()
