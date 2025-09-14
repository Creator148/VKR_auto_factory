// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./Interfaces.sol";

contract ShipmentContract is IShipment {
    struct Shipment {
        uint256 id;
        uint256 contractId; // ссылка на PurchaseContract / Tender
        address shipper;
        string nfcTag;
        string gps;
        string docCID;
        uint256 shippedAt;
        uint256 receivedAt;
        bool received;
    }

    uint256 public nextShipmentId;
    mapping(uint256 => Shipment) public shipments;

    /// @notice record an outbound shipment
    function recordShipment(uint256 contractId, string calldata nfcTag, string calldata gps, string calldata docCID) external override returns (uint256) {
        nextShipmentId++;
        uint256 sid = nextShipmentId;
        shipments[sid] = Shipment(sid, contractId, msg.sender, nfcTag, gps, docCID, block.timestamp, 0, false);
        emit ShipmentRecorded(sid, contractId, msg.sender, nfcTag, gps, docCID);
        return sid;
    }

    /// @notice confirm receipt at warehouse/receiver
    function confirmReceipt(uint256 shipmentId) external override {
        Shipment storage s = shipments[shipmentId];
        require(s.id != 0, "Shipment: not found");
        require(!s.received, "Shipment: already received");

        s.receivedAt = block.timestamp;
        s.received = true;

        emit GoodsReceived(shipmentId, s.contractId, s.shipper, msg.sender);
    }
}
