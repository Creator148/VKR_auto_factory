import { Tender } from "./tender.model";
import { Bid } from "./bid.model";
import { Supplier } from "./supplier.model";
import { Shipment } from "./shipment.model";
import { Payment } from "./payment.model";

// Tender -> Bid
Tender.hasMany(Bid, { foreignKey: "tenderId", as: "bids" });
Bid.belongsTo(Tender, { foreignKey: "tenderId" });

// Supplier -> Bid
Supplier.hasMany(Bid, { foreignKey: "supplierId", as: "supplierBids" });
Bid.belongsTo(Supplier, { foreignKey: "supplierId", as: "supplier" });

// Tender -> Shipment
Tender.hasMany(Shipment, { foreignKey: "tenderId", as: "shipments" });
Shipment.belongsTo(Tender, { foreignKey: "tenderId" });

// Shipment -> Payment
Shipment.hasOne(Payment, { foreignKey: "shipmentId", as: "payment" });
Payment.belongsTo(Shipment, { foreignKey: "shipmentId" });

// Tender winner mapping
Tender.belongsTo(Supplier, { foreignKey: "winnerId", as: "winner" });

export { Tender, Bid, Supplier, Shipment, Payment };
