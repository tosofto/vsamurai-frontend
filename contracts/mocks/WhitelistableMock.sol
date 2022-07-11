// SPDX-License-Identifier: MIT
// BuildingIdeas.io (WithlistableMock.sol)

pragma solidity ^0.8.11;

import "../Whitelistable.sol";

contract WhitelistableMock is Whitelistable {
  uint256 public x = 0;

  constructor(address signerPubKey) Whitelistable(signerPubKey){}

  function increment(bytes calldata signature) public requiresWhitelist(signature) {
    x += 1;
  }
}