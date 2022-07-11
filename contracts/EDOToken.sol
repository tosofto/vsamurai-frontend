// SPDX-License-Identifier: MIT
// .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------. 
// | .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
// | | ____   ____  | || |    _______   | || |      __      | || | ____    ____ | || | _____  _____ | || |  _______     | || |      __      | || |     _____    | |
// | ||_  _| |_  _| | || |   /  ___  |  | || |     /  \     | || ||_   \  /   _|| || ||_   _||_   _|| || | |_   __ \    | || |     /  \     | || |    |_   _|   | |
// | |  \ \   / /   | || |  |  (__ \_|  | || |    / /\ \    | || |  |   \/   |  | || |  | |    | |  | || |   | |__) |   | || |    / /\ \    | || |      | |     | |
// | |   \ \ / /    | || |   '.___`-.   | || |   / ____ \   | || |  | |\  /| |  | || |  | '    ' |  | || |   |  __ /    | || |   / ____ \   | || |      | |     | |
// | |    \ ' /     | || |  |`\____) |  | || | _/ /    \ \_ | || | _| |_\/_| |_ | || |   \ `--' /   | || |  _| |  \ \_  | || | _/ /    \ \_ | || |     _| |_    | |
// | |     \_/      | || |  |_______.'  | || ||____|  |____|| || ||_____||_____|| || |    `.__.'    | || | |____| |___| | || ||____|  |____|| || |    |_____|   | |
// | |              | || |              | || |              | || |              | || |              | || |              | || |              | || |              | |
// | '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
// '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------' |
// Website: https://vsamurai.io
// Developers: https://buildingideas.io
// EDO Token v2
pragma solidity ^0.8.11;
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EDOToken is ERC20, Ownable {
  using ECDSA for bytes32;

  // Yield rates for each rarity
  uint256[20] public tokenRates;
  
  // TokenID -> Rarity ID (1,2,3,4)
  mapping (uint256 => uint256) public rarities;

  // Rewards per NFT ID per Address
	mapping(address => mapping (uint256 => uint256)) public rewards;
	mapping(address => mapping (uint256 => uint256)) public lastUpdate;

	IERC721 public vSamuraiContract;

	address public signingKey = address(0);
	bytes32 public DOMAIN_SEPARATOR;

	uint256 constant public INITIAL_ISSUANCE = 75 ether;

	bytes32 public constant SIGNUP_FOR_REWARDS_TYPEHASH = keccak256("Rewards(address wallet,uint256 tokenId,uint256 rarityId)");

  uint256 public MAX_SUPPLY = 200000000 ether;
  uint256 public TOTAL_MINTED = 0 ether;

	constructor(address _vsamurai, address _newOwner, address _signingKey) ERC20("EDO", "EDO") {
		signingKey = _signingKey;
		DOMAIN_SEPARATOR = keccak256(
		abi.encode(
			keccak256(
			"EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
			),
			keccak256(bytes("RegisterForRewards")),
			keccak256(bytes("1")),
			block.chainid,
			address(this)
		)
		);
    tokenRates[1] = 2; // Samurai (common)
    tokenRates[2] = 4; // Ronin (uncommon)
    tokenRates[3] = 7; // Shogun (rare)
    tokenRates[4] = 10; // Emperor (epic)
    tokenRates[5] = 20; // 1/1 (legendary)
    tokenRates[6] = 20; // 2nd gen common
    tokenRates[7] = 40; // 2nd gen uncommon
    tokenRates[8] = 70; // 2nd gen rare
    tokenRates[9] = 100; // 2nd gen epic
    tokenRates[10] = 200; // 2nd gen legenday
    tokenRates[11] = 40; // 3rd gen common
    tokenRates[12] = 140; // 3rd gen uncommon
    tokenRates[13] = 80; // 3rd gen rare
    tokenRates[14] = 200; // 3rd gen epic
    tokenRates[15] = 400; // 3rd gen legenday
		vSamuraiContract = IERC721(_vsamurai);
		_transferOwnership(_newOwner);
    _mint(_newOwner, 7500000 ether);
    TOTAL_MINTED += 7500000 ether;
	}

  function setTokenRates(
    uint256[20] calldata _newRates
    ) public onlyOwner {
      for(uint256 i = 0; i<_newRates.length; i++) {
        tokenRates[i] = _newRates[i];
      }
  }

  function getTokenRates(uint256 tokenId) public view returns(uint256) {
    return tokenRates[rarities[tokenId]];
  }

  function setSigningAddress(address newSigningKey) public onlyOwner {
    signingKey = newSigningKey;
  }

  modifier isAllowed() {
    require(_msgSender() == address(vSamuraiContract), "Caller not authorized");
    _;
  }

  function setNFTContract(address _vsamurai) external onlyOwner {
    vSamuraiContract = IERC721(_vsamurai);
  }

	function updateReward(address _from, address _to, uint256 _tokenId) external isAllowed {
    _updateRewards(_from, _to, _tokenId);
	}

  function _updateRewards(address _from, address _to, uint256 _tokenId) internal {
    uint256 tokenRate = getTokenRates(_tokenId);
    uint256 time = block.timestamp;
    uint256 timerFrom = lastUpdate[_from][_tokenId];

    if (timerFrom > 0) {
      rewards[_from][_tokenId] += tokenRate * (time - timerFrom) / 86400;
    }

    lastUpdate[_from][_tokenId] = time;

    if (_to != address(0)) {
      lastUpdate[_to][_tokenId] = time;
    }
  }

  event RewardClaimed(address indexed user, uint256 reward);

  function claimRewards(uint256 _nftId) external {
    require(address(vSamuraiContract) != address(0), 'NFT contract not set');
    require(vSamuraiContract.ownerOf(_nftId) == _msgSender(), 'You are not the nft owner');
    _updateRewards(_msgSender(), address(0), _nftId);
    _mintRewards(_msgSender(), _nftId);
	}

  function min(uint256 a, uint256 b) internal pure returns (uint256) {
    return a <= b ? a : b;
  }

	function _mintRewards(address _from, uint256 _tokenId) internal {
		uint256 reward = rewards[_from][_tokenId];
		if (reward > 0) {
      require(MAX_SUPPLY > TOTAL_MINTED, "Exceeds max supply");
			rewards[_from][_tokenId] = 0;
      uint256 amounToMint = min(MAX_SUPPLY - TOTAL_MINTED, reward);
      _mint(_from, amounToMint);
      TOTAL_MINTED += amounToMint;
      emit RewardClaimed(_from, amounToMint);
		}
	}

	function burn(address _from, uint256 _amount) external isAllowed {
		_burn(_from, _amount);
	}

	function getTotalClaimable(address _from, uint256 _tokenId) external view returns(uint256) {
    uint256 tokenRate = getTokenRates(_tokenId);
		uint256 time = block.timestamp;
    if (vSamuraiContract.ownerOf(_tokenId) == _from) {
		  uint256 pending = tokenRate * (time - lastUpdate[_from][_tokenId]) / 86400;
		  return rewards[_from][_tokenId] + pending;
    }
    return rewards[_from][_tokenId];
	}

  modifier withValidSignature(bytes calldata signature, uint256 _tokenId, uint256 _rarity) {
    require(signingKey != address(0), "rewards not enabled");
    // Verify EIP-712 signature by recreating the data structure
    // that we signed on the client side, and then using that to recover
    // the address that signed the signature for this data.
    bytes32 digest = keccak256(
        abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(
              abi.encode(
                SIGNUP_FOR_REWARDS_TYPEHASH, 
                _msgSender(),
                _tokenId,
                _rarity
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

  function registerForRewards(bytes calldata signature, uint256 _tokenId, uint256 _rarity) public withValidSignature(signature, _tokenId, _rarity) {
    require(rarities[_tokenId] == 0, 'Token cannot be registered for rewards more than once');
    require(vSamuraiContract.ownerOf(_tokenId) == _msgSender(), 'You are not the nft owner');
    rarities[_tokenId] = _rarity;
    rewards[_msgSender()][_tokenId] = rewards[_msgSender()][_tokenId] + INITIAL_ISSUANCE;
		lastUpdate[_msgSender()][_tokenId] = block.timestamp;
  }

  function adminRarityRegistration(uint256 _tokenId, uint256 _rarity, address _tokenOwner) public onlyOwner {
    rarities[_tokenId] = _rarity;
    rewards[_tokenOwner][_tokenId] = rewards[_tokenOwner][_tokenId] + INITIAL_ISSUANCE;
    lastUpdate[_tokenOwner][_tokenId] = block.timestamp;
  }


  function bulkAdminRarityRegistration(uint256[] calldata _tokenIds, uint256[] calldata  _rarities, address[] calldata _tokenOwners) public onlyOwner {
    require(_tokenIds.length == _rarities.length, "Arrays must much length");
    require(_rarities.length == _tokenOwners.length, "Arrays must much length");
    for(uint256 i = 0; i < _tokenIds.length; i++) {
      rarities[_tokenIds[i]] = _rarities[i];
      rewards[_tokenOwners[i]][_tokenIds[i]] = rewards[_tokenOwners[i]][_tokenIds[i]] + INITIAL_ISSUANCE;
      lastUpdate[_tokenOwners[i]][_tokenIds[i]] = block.timestamp;
    }
  }

  function changeMaxSupply(uint256 _newMaxSupply) public onlyOwner {
    require(_newMaxSupply > TOTAL_MINTED, "The new max supply must be greater than the total tokens minted");
    MAX_SUPPLY = _newMaxSupply;
  }
}