// SPDX-License-Identifier: MIT
// BuildingIdeas.io (vSamuraiMock.sol)

pragma solidity ^0.8.11;

import "@openzeppelin/contracts/utils/Context.sol";
import "../IEDOToken.sol";

contract vSamuraiMock is Context {

  mapping(uint256 => address) public ownership;

  function setOwner(address _address, uint256 nftId) public {
    ownership[nftId] = _address;
  }

  function ownerOf(uint256 nftId) view public returns (address) {
    return ownership[nftId];
  }

  function balanceOf(address _somebody) public pure returns(uint256) {
    require(address(_somebody) != address(0), 'Cant get balance for address 0');
    return 10;
  }

  function doBurnsEDO(address from, uint256 amount, address edoTokenAddress) public {
    IEDOToken token = IEDOToken(edoTokenAddress);
    token.burn(from, amount);
  }

  function transfer(address edoTokenAddress, address from, address to, uint256 tokenId) public {
    IEDOToken token = IEDOToken(edoTokenAddress);
    token.updateReward(from, to, tokenId);
    setOwner(to, tokenId);
  }
}