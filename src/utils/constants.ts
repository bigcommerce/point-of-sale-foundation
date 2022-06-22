export const statusMapColors = {
  Pending: '#879193',
  AwaitingPayment: '#ff9000',
  AwaitingFulfillment: '#72cdfa',
  AwaitingShipment: '#cd3101',
  AwaitingPickup: '#c979f2',
  PartiallyShipped: '#4a6fb3',
  Completed: '#bddf57',
  Shipped: '#bddf57',
  Cancelled: '#000',
  Declined: '#7f5f3c',
  Refunded: '#fccb05',
  Disputed: '#96f',
  ManualVerificationRequired: '#e7a0ae',
  PartiallyRefunded: '#fccb05',
  None: '#ffffff',
};

export const getColorFromStatus = (status) => {
  const type = status ? status.replace(/\s/g, '') : "";
  switch (type) {
    case 'Pending':
      return statusMapColors.Pending;
    case 'AwaitingPayment':
      return statusMapColors.AwaitingPayment;
    case 'AwaitingFulfillment':
      return statusMapColors.AwaitingFulfillment;
    case 'AwaitingShipment':
      return statusMapColors.AwaitingShipment;
    case 'AwaitingPickup':
      return statusMapColors.AwaitingPickup;
    case 'PartiallyShipped':
      return statusMapColors.PartiallyShipped;
    case 'Completed':
      return statusMapColors.Completed;
    case 'Shipped':
      return statusMapColors.Shipped;
    case 'Cancelled':
      return statusMapColors.Cancelled;
    case 'Declined':
      return statusMapColors.Declined;
    case 'Refunded':
      return statusMapColors.Refunded;
    case 'Disputed':
      return statusMapColors.Disputed;
    case 'ManualVerificationRequired':
      return statusMapColors.ManualVerificationRequired;
    case 'PartiallyRefunded':
      return statusMapColors.PartiallyRefunded;
    default:
      return statusMapColors.None;
  };
};