// SPDX-License-Identifier: MIT
// BuildingIdeas.io (BreedingManager.sol)

pragma solidity ^0.8.11;
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BreedingManager is Ownable {
  using ECDSA for bytes32;
  IERC721 public vSamuraiContract;


  bytes32 public DOMAIN_SEPARATOR;
  mapping (uint256 => uint256) public gender;
  bytes32 public constant SIGNUP_FOR_BREEDING_TYPEHASH = keccak256("Breed(address wallet,uint256 tokenId,uint256 genderId)");
  address public signingKey = address(0);
  
  constructor(address _vsamurai, address _newOwner, address _signingKey) {
    signingKey = _signingKey;
    vSamuraiContract = IERC721(_vsamurai);
    _transferOwnership(_newOwner);

    DOMAIN_SEPARATOR = keccak256(
      abi.encode(
        keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        ),
        keccak256(bytes("RegisterForBreeding")),
        keccak256(bytes("1")),
        block.chainid,
        address(this)
      )
		);
  }

  modifier withValidSignatureGender(bytes calldata signature, uint256 _tokenId, uint256 _gender) {
    /* require(signingKey != address(0), "whitelist not enabled"); */
    // Verify EIP-712 signature by recreating the data structure
    // that we signed on the client side, and then using that to recover
    // the address that signed the signature for this data.
    bytes32 digest = keccak256(
        abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(
              abi.encode(
                SIGNUP_FOR_BREEDING_TYPEHASH, 
                _msgSender(),
                _tokenId,
                _gender
              )
            )
        )
    );
    // Use the recover method to see what address was used to create
    // the signature on this data.
    // Note that if the digest doesn't exactly match what was signed we'll
    // get a random recovered address.
    address recoveredAddress = digest.recover(signature);
    require(recoveredAddress == signingKey, "Invalid Signature");
    _;
  }

  modifier isAllowed() {
    require(_msgSender() == address(vSamuraiContract), "Caller not authorized");
    _;
  }

  function breed(uint _male, uint _female) public view returns(bool) {
    require(gender[_male] == 1, "NFT is not male");
    require(gender[_female] == 2, "NFT is not female");
    return true;
  }


  function registerGender(bytes calldata signature, uint256 _tokenId, uint256 _gender) public withValidSignatureGender(signature, _tokenId, _gender) {
    gender[_tokenId] = _gender;

  }

}