export enum OrderStatus {
    Incomplete,
    Pending,
    Shipped,
    Partially_Shipped,
    Refunded,
    Cancelled,
    Declined,
    Awaiting_Payment,
    Awaiting_Pickup,
    Awaiting_Shipment,
    Completed,
    Awaiting_Fulfillment,
    Manual_Verification_Required,
    Disputed,
    Partially_Refunded,
}

export enum PaymentMethod {
    CreditCard = "Credit Card",
    Cash = "Cash",
    TestPaymentGateway = "Test Payment Gateway",
    Manual = "Manual",
}

export enum PaymentStatus {
    Authorized = "authorized",
    Captured = "captured",
    Capture_Pending = "capture pending",
    Declined = "declined",
    Held_For_Review = "held for review",
    Paid = "paid",
    Partially_Refunded = "partially refunded",
    Pending = "pending",
    Refunded = "refunded",
    Void = "void",
    Void_Pending = "void pending",
}

export enum TaxProviderId {
    BasicTaxProvider = "BasicTaxProvider",
    AvaTaxProvider = "AvaTaxProvider",
    Empty = "",
}