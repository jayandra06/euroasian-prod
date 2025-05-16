import React from 'react';

interface OrderItem {
  itemName: string;
  description?: string;
  itemCode?: string;
  quantityOrdered: number;
  unitPrice?: number;
  totalPrice?: number;
  deliveredQuantity?: number;
}

interface OrderDetailsProps {
  orderId: string | number;
  rfqId?: string | number;
  customerName: string;
  customerAccountId?: string | number;
  orderDate: Date | string;
  salesOrderStatus: string;
  deliveryLocation?: string;
  deliveryDate?: Date | string;
  orderedItems: OrderItem[];
  claimId?: string | number;
  claimStatus?: string;
  claimCreationDate?: Date | string;
  claimType?: string;
  claimReason?: string;
  supportingDocuments?: string[]; // Could be URLs or identifiers
  salesRepresentative?: string;
  customerContact?: string;
  logisticsCarrier?: string;
  trackingNumber?: string;
  onInitiateNewClaim?: (orderId: string | number) => void;
  onViewClaimDetails?: (claimId: string | number) => void;
  onAddSupportingDocument?: (orderId: string | number) => void;
  // Add other relevant action handlers as needed
}

const SchadCdnClaimOrderDetails: React.FC<OrderDetailsProps> = ({
  orderId,
  rfqId,
  customerName,
  customerAccountId,
  orderDate,
  salesOrderStatus,
  deliveryLocation,
  deliveryDate,
  orderedItems,
  claimId,
  claimStatus,
  claimCreationDate,
  claimType,
  claimReason,
  supportingDocuments,
  salesRepresentative,
  customerContact,
  logisticsCarrier,
  trackingNumber,
  onInitiateNewClaim,
  onViewClaimDetails,
  onAddSupportingDocument,
}) => {
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">SCHAD CDN Claim - Order Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <strong>Order ID:</strong> {orderId}
        </div>
        {rfqId && (
          <div>
            <strong>RFQ ID:</strong> {rfqId}
          </div>
        )}
        <div>
          <strong>Customer Name:</strong> {customerName}
        </div>
        {customerAccountId && (
          <div>
            <strong>Customer Account ID:</strong> {customerAccountId}
          </div>
        )}
        <div>
          <strong>Order Date:</strong> {new Date(orderDate).toLocaleDateString()}
        </div>
        <div>
          <strong>Sales Order Status:</strong> {salesOrderStatus}
        </div>
        {deliveryLocation && (
          <div>
            <strong>Delivery Location:</strong> {deliveryLocation}
          </div>
        )}
        {deliveryDate && (
          <div>
            <strong>Delivery Date:</strong> {new Date(deliveryDate).toLocaleDateString()}
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2">Ordered Items</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Item Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Item Code</th>
              <th className="py-2 px-4 border-b">Quantity Ordered</th>
              <th className="py-2 px-4 border-b">Unit Price</th>
              <th className="py-2 px-4 border-b">Total Price</th>
              <th className="py-2 px-4 border-b">Delivered Quantity</th>
            </tr>
          </thead>
          <tbody>
            {orderedItems.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-2 px-4 border-b">{item.itemName}</td>
                <td className="py-2 px-4 border-b">{item.description}</td>
                <td className="py-2 px-4 border-b">{item.itemCode}</td>
                <td className="py-2 px-4 border-b">{item.quantityOrdered}</td>
                <td className="py-2 px-4 border-b">{item.unitPrice ? `$${item.unitPrice.toFixed(2)}` : '-'}</td>
                <td className="py-2 px-4 border-b">{item.totalPrice ? `$${item.totalPrice.toFixed(2)}` : '-'}</td>
                <td className="py-2 px-4 border-b">{item.deliveredQuantity !== undefined ? item.deliveredQuantity : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(claimId || claimStatus || claimCreationDate || claimType || claimReason || supportingDocuments) && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Claim Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {claimId && (
              <div>
                <strong>Claim ID:</strong> {claimId}
              </div>
            )}
            {claimStatus && (
              <div>
                <strong>Claim Status:</strong> {claimStatus}
              </div>
            )}
            {claimCreationDate && (
              <div>
                <strong>Claim Creation Date:</strong> {new Date(claimCreationDate).toLocaleDateString()}
              </div>
            )}
            {claimType && (
              <div>
                <strong>Claim Type:</strong> {claimType}
              </div>
            )}
            {claimReason && (
              <div>
                <strong>Claim Reason:</strong> {claimReason}
              </div>
            )}
            {supportingDocuments && supportingDocuments.length > 0 && (
              <div>
                <strong>Supporting Documents:</strong>
               
               
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {salesRepresentative && (
          <div>
            <strong>Sales Representative:</strong> {salesRepresentative}
          </div>
        )}
        {customerContact && (
          <div>
            <strong>Customer Contact:</strong> {customerContact}
          </div>
        )}
        {logisticsCarrier && (
          <div>
            <strong>Logistics Carrier:</strong> {logisticsCarrier}
          </div>
        )}
        {trackingNumber && (
          <div>
            <strong>Tracking Number:</strong> {trackingNumber}
          </div>
        )}
      </div>

      <div className="mt-6 border-t pt-4 flex justify-end gap-2">
        {onInitiateNewClaim && (
          <button
            onClick={() => onInitiateNewClaim(orderId)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Initiate New Claim
          </button>
        )}
        {claimId && onViewClaimDetails && (
          <button
            onClick={() => onViewClaimDetails(claimId)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            View Claim Details
          </button>
        )}
        {onAddSupportingDocument && (
          <button
            onClick={() => onAddSupportingDocument(orderId)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Supporting Document
          </button>
        )}
        {/* Add other action buttons as needed */}
      </div>
    </div>
  );
};

export default SchadCdnClaimOrderDetails;