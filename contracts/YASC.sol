pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";
import "zeppelin-solidity/contracts/token/ERC827/ERC827Token.sol";
import "zeppelin-solidity/contracts/ownership/CanReclaimToken.sol";


contract YASC is MintableToken, BurnableToken, ERC827Token, CanReclaimToken {

    function burn(uint256 _value) public onlyOwner {
        super.burn(_value);
    }

}
