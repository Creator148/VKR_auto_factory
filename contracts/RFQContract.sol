// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./Interfaces.sol";

/// @title RFQContract — create tenders and collect bids
/// @notice Минимальная реализация: хранит тендеры и биды, генерирует события.
/// @dev Для прототипа достаточно этого контракта; на проде добавлять role-checks, pausability и др.
contract RFQContract is IRFQ {
    enum TenderStatus { NONE, OPEN, AWARDED, CLOSED, CANCELLED }
    enum BidStatus { NONE, ACTIVE, WITHDRAWN, ACCEPTED, REJECTED }

    struct Tender {
        uint256 id;
        address requester;
        string detailsCID; // IPFS CID / metadata
        uint256 deadline;
        TenderStatus status;
        uint256 awardedBidId;
        uint256 createdAt;
    }

    struct Bid {
        uint256 id;
        address supplier;
        uint256 price; // in wei or preferred unit
        uint256 deliveryTime; // in seconds or days (domain convention)
        string metadataCID;
        BidStatus status;
        uint256 submittedAt;
    }

    uint256 public nextTenderId;
    mapping(uint256 => Tender) public tenders;
    mapping(uint256 => Bid[]) internal tenderBids;

    /// @notice create a tender
    function createTender(string calldata detailsCID, uint256 deadline) external override returns (uint256) {
        require(deadline > block.timestamp, "RFQ: deadline must be in future");
        nextTenderId++;
        uint256 tid = nextTenderId;
        tenders[tid] = Tender(tid, msg.sender, detailsCID, deadline, TenderStatus.OPEN, 0, block.timestamp);
        emit TenderCreated(tid, msg.sender, detailsCID, deadline);
        return tid;
    }

    /// @notice submit bid for tender
    function submitBid(uint256 tenderId, uint256 price, uint256 deliveryTime, string calldata metadataCID) external override returns (uint256) {
        Tender storage t = tenders[tenderId];
        require(t.id != 0 && t.status == TenderStatus.OPEN, "RFQ: invalid or closed tender");
        require(block.timestamp <= t.deadline, "RFQ: deadline passed");

        uint256 bidId = tenderBids[tenderId].length + 1;
        tenderBids[tenderId].push(Bid(bidId, msg.sender, price, deliveryTime, metadataCID, BidStatus.ACTIVE, block.timestamp));

        emit BidSubmitted(tenderId, bidId, msg.sender, price, deliveryTime, metadataCID);
        return bidId;
    }

    /// @notice award bid (only tender requester can call)
    function awardBid(uint256 tenderId, uint256 bidId) external override {
        Tender storage t = tenders[tenderId];
        require(t.id != 0, "RFQ: no tender");
        require(msg.sender == t.requester, "RFQ: only requester");
        require(t.status == TenderStatus.OPEN, "RFQ: not open");

        require(bidId >= 1 && bidId <= tenderBids[tenderId].length, "RFQ: bid not found");
        Bid storage b = tenderBids[tenderId][bidId - 1];
        require(b.supplier != address(0), "RFQ: invalid bid");

        // set accepted / awarded
        t.awardedBidId = bidId;
        t.status = TenderStatus.AWARDED;
        b.status = BidStatus.ACCEPTED;

        emit BidAwarded(tenderId, bidId, b.supplier, b.price);
    }

    /// @notice view number of bids for tender
    function bidsCount(uint256 tenderId) external view returns (uint256) {
        return tenderBids[tenderId].length;
    }

    /// @notice get brief bid info (avoids returning full struct array)
    function getBid(uint256 tenderId, uint256 bidIndex) external view returns (
        uint256 id,
        address supplier,
        uint256 price,
        uint256 deliveryTime,
        string memory metadataCID,
        uint8 status,
        uint256 submittedAt
    ) {
        require(bidIndex >= 1 && bidIndex <= tenderBids[tenderId].length, "RFQ: bidIndex out of range");
        Bid storage b = tenderBids[tenderId][bidIndex - 1];
        return (b.id, b.supplier, b.price, b.deliveryTime, b.metadataCID, uint8(b.status), b.submittedAt);
    }
}
