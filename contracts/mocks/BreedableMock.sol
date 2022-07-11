
// SPDX-License-Identifier: MIT
// BuildingIdeas.io (BreedableMock.sol)

pragma solidity ^0.8.11;

import "../Breedable.sol";
import "../IBreedManager.sol";
import "../IEDOToken.sol";
import "../ERC721A.sol";


contract BreedManagerMock is IBreedManager {
  constructor(){
  }
  function breed(uint256 _male, uint256 _female) external returns(bool){
    return true;
  }
  function registerGender(bytes calldata signature, uint256 _tokenId, uint256 _gender) external{
    
  }
}

contract yieldTokenMock is IEDOToken {
  constructor(){
    
  }
 /*  event RewardClaimed(address indexed from, uint256 reward){} */
  function getTotalClaimable(address _from, uint256 _tokenId) external view returns(uint256){

  }
  function updateReward(address _from, address _to, uint256 _tokenId) external{

  }
  function getReward(address _from, uint256 _tokenId) external{

  }
  function burn(address _from, uint256 _amount) external{

  }
}

contract BreedableMock is ERC721A, Breedable  {
    constructor( ) 
        ERC721A("SVMock","SVM")
    {}

  function testBreed(uint256 _male, uint256 _female) external {
    require(breedManager.breed(_male, _female), "You cannot breed both of the same gender");
    yieldToken.burn(_msgSender(), BREED_PRICE); 
    _safeMint(_msgSender(), 1);
  }
  
  function setBreedingManagerTest(address _manager) external onlyOwner {
	  breedManager = IBreedManager(_manager);
  }

  function setBreedPriceTest(uint256 _breedPrice) external onlyOwner {
	BREED_PRICE = _breedPrice;
  }

  function flipBreedingActiveTest() external onlyOwner {
	BREEDING_ACTIVE = !BREEDING_ACTIVE;
  }

  function setTokenAddress(address _address) external{
    yieldToken = IEDOToken(_address);
  }
}