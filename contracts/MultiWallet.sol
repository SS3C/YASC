pragma solidity ^0.4.23;

import "../libs/Multiownable.sol";


contract MultiWallet is Multiownable {

    function performAction(address target, bytes action) public payable onlyManyOwners {
        // solium-disable-next-line security/no-call-value
        require(target.call.value(msg.value)(action));
    }

}