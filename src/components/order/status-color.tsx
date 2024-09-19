const StatusColor = (status: string) => {
  let bg_class = '';
  if (
    status?.toLowerCase() === 'pending' ||
    status?.toLowerCase() === 'pending' ||
    status?.toLowerCase() === 'payment-pending'
  ) {
    bg_class = 'bg-status-pending bg-opacity-10 text-status-pending';
  } else if (
    status?.toLowerCase() === 'processing' ||
    status?.toLowerCase() === 'processing' ||
    status?.toLowerCase() === 'payment-processing'
  ) {
    bg_class = 'bg-status-processing bg-opacity-10 text-status-processing';
  } else if (
    status?.toLowerCase() === 'completed' ||
    status?.toLowerCase() === 'approved' ||
    status?.toLowerCase() === 'payment-success'
  ) {
    bg_class = 'bg-status-complete bg-opacity-10 text-status-complete';
  } else if (
    status?.toLowerCase() === 'cancelled' ||
    status?.toLowerCase() === 'rejected' ||
    status?.toLowerCase() === 'payment-reversal'
  ) {
    bg_class = 'bg-status-canceled bg-opacity-10 text-status-canceled';
  } else if (
    status?.toLowerCase() === 'failed' ||
    status?.toLowerCase() === 'payment-failed'
  ) {
    bg_class = 'bg-status-failed bg-opacity-10 text-status-failed';
  } else if (status?.toLowerCase() === 'at-local-facility') {
    bg_class =
      'bg-status-out-for-delivery bg-opacity-10 text-status-out-for-delivery';
  } else if (status?.toLowerCase() === 'out-for-delivery') {
    bg_class =
      'bg-status-out-for-delivery bg-opacity-10 text-status-out-for-delivery';
  } else if (
    status?.toLowerCase() === 'refunded' ||
    status?.toLowerCase() === 'refunded' ||
    status?.toLowerCase() === 'payment-refunded'
  ) {
    bg_class = 'bg-rose-400 bg-opacity-10 text-status-pending';
  } else {
    bg_class = 'bg-accent bg-opacity-10 !text-accent';
  }

  return bg_class;
};

export default StatusColor;
