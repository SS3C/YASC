pragma solidity ^0.4.23;

import "../libs/Multiownable.sol";


contract MultiWallet is Multiownable {

    function performAction(address target, bytes action, uint256 id) public payable onlyManyOwnersWithID(id) {
        // solium-disable-next-line security/no-call-value
        require(target.call.value(msg.value)(action));
    }

}