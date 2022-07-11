 async function getWhitelistSignature(contractAddress, chainId, signer, userAddress) {
  // Domain data should match whats specified in the DOMAIN_SEPARATOR constructed in the contract
  // https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol#L33-L43
  const domain = {
    name: "WhitelistMint",
    version: "1",
    chainId,
    verifyingContract: contractAddress,
  };

  // The types should match the TYPEHASH specified in the contract
  // https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol#L27-L28
  const types = {
    Minter: [{ name: "wallet", type: "address" }],
  };
  const value = {
    wallet: userAddress
  }
  const signature = await signer._signTypedData(domain, types, value);

  return signature;
}

async function getRarityRegistrationSignature(contractAddress, chainId, signer, userAddress, rarityId, nftId) {
  // Domain data should match whats specified in the DOMAIN_SEPARATOR constructed in the contract
  // https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol#L33-L43
  const domain = {
    name: "RegisterForRewards",
    version: "1",
    chainId,
    verifyingContract: contractAddress,
  };

  // The types should match the TYPEHASH specified in the contract
  // https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol#L27-L28
  const types = {
    Rewards: [
      {
        name: "wallet",
        type: "address",
      }, 
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "rarityId",
        type: "uint256"
      }
    ]
  };
  const value = {
    wallet: userAddress,
    tokenId: nftId,
    rarityId: rarityId,
  }
  const signature = await signer._signTypedData(domain, types, value);

  return signature;
}

async function getBreedingManagerSignature(contractAddress, chainId, signer, userAddress, genderId, nftId) {
  const domain = {
    name: "RegisterForBreeding",
    version: "1",
    chainId,
    verifyingContract: contractAddress,
  };

  // The types should match the TYPEHASH specified in the contract
  // https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol#L27-L28
  const types = {
    Breed: [
      {
        name: "wallet",
        type: "address",
      }, 
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "genderId",
        type: "uint256"
      }
    ]
  };
  const value = {
    wallet: userAddress,
    tokenId: nftId,
    genderId: genderId,
  }
  const signature = await signer._signTypedData(domain, types, value);

  return signature
}


module.exports = {
  getWhitelistSignature,
  getRarityRegistrationSignature,
  getBreedingManagerSignature
};