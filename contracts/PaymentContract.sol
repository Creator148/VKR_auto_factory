// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./Interfaces.sol";

contract PaymentContract is IPayment {
    struct Escrow {
        uint256 tenderId;
        address payer;
        address beneficiary;
        uint256 amount;
        bool released;
    }

    mapping(uint256 => Escrow) public escrows;

    /// @notice deposit funds to escrow for a tender
    function depositFunds(uint256 tenderId, address beneficiary) external payable override {
        require(msg.value > 0, "Payment: must send funds");
        Escrow storage e = escrows[tenderId];
        require(e.amount == 0, "Payment: already funded"); // simple guard for prototype

        e.tenderId = tenderId;
        e.payer = msg.sender;
        e.beneficiary = beneficiary;
        e.amount = msg.value;
        e.released = false;

        emit FundsDeposited(tenderId, msg.sender, beneficiary, msg.value);
    }

    /// @notice release funds to beneficiary (callable by payer or owner logic in production)
    function releasePayment(uint256 tenderId) external override {
        Escrow storage e = escrows[tenderId];
        require(e.amount > 0, "Payment: no funds");
        require(!e.released, "Payment: already released");

        e.released = true;
        uint256 amount = e.amount;
        address payable to = payable(e.beneficiary);
        // transfer (prototype; production should use pull-payments or checks-effects-interactions)
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Payment: transfer failed");

        emit PaymentReleased(tenderId, e.beneficiary, amount);
    }

    /// @notice refund payer (simple flow)
    function refund(uint256 tenderId) external override {
        Escrow storage e = escrows[tenderId];
        require(e.amount > 0, "Payment: no funds");
        require(!e.released, "Payment: already released");
        require(msg.sender == e.payer, "Payment: only payer");

        uint256 amount = e.amount;
        address payable to = payable(e.payer);
        e.amount = 0;
        e.released = true;

        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Payment: refund failed");

        emit RefundIssued(tenderId, e.payer, amount);
    }
}
