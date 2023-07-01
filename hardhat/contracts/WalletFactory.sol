// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "./SmartWallet.sol";
import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";

contract WalletFactory {
    event WalletCreated(
        address indexed wallet,
        address indexed owner,
        uint indexed salt
    );

    uint public salt;

    function createWallet(
        address[] memory _owners,
        uint _numConfirmationsRequired
    ) external returns (address) {
        address wallet = Create2.deploy(
            0,
            bytes32(salt),
            type(SmartWallet).creationCode
        );
        SmartWallet(payable(wallet)).initialize(
            _owners,
            _numConfirmationsRequired
        );
        salt = salt + 1;
        emit WalletCreated(wallet, msg.sender, salt);
        return wallet;
    }

    function getAddress() public view returns (address) {
        return
            Create2.computeAddress(
                bytes32(salt),
                keccak256(type(SmartWallet).creationCode)
            );
    }
}
