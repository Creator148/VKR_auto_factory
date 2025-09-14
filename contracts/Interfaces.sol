// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @notice Common interfaces used by supply-chain contracts (lightweight).
interface IRFQ {
    event TenderCreated(uint256 indexed tenderId, address indexed requester, string detailsCID, uint256 deadline);
    event BidSubmitted(uint256 indexed tenderId, uint256 indexed bidId, address indexed supplier, uint256 price, uint256 deliveryTime, string metadataCID);
    event BidAwarded(uint256 indexed tenderId, uint256 indexed bidId, address indexed supplier, uint256 price);

    function createTender(string calldata detailsCID, uint256 deadline) external returns (uint256);
    function submitBid(uint256 tenderId, uint256 price, uint256 deliveryTime, string calldata metadataCID) external returns (uint256);
    function awardBid(uint256 tenderId, uint256 bidId) external;
}

interface IShipment {
    event ShipmentRecorded(uint256 indexed shipmentId, uint256 indexed contractId, address indexed shipper, string nfcTag, string gps, string docCID);
    event GoodsReceived(uint256 indexed shipmentId, uint256 indexed contractId, address shipper, address receiver);

    function recordShipment(uint256 contractId, string calldata nfcTag, string calldata gps, string calldata docCID) external returns (uint256);
    function confirmReceipt(uint256 shipmentId) external;
}

interface IPayment {
    event FundsDeposited(uint256 indexed tenderId, address indexed payer, address beneficiary, uint256 amount);
    event PaymentReleased(uint256 indexed tenderId, address indexed beneficiary, uint256 amount);
    event RefundIssued(uint256 indexed tenderId, address indexed payer, uint256 amount);

    function depositFunds(uint256 tenderId, address beneficiary) external payable;
    function releasePayment(uint256 tenderId) external;
    function refund(uint256 tenderId) external;
}
