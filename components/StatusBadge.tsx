import React from 'react';
import { REQUEST_STATUSES, BOOKING_STATUSES, PAYMENT_STATUSES } from '../lib/constants';

interface StatusBadgeProps {
  type: 'request' | 'booking' | 'payment';
  status: string;
}

export default function StatusBadge({ type, status }: StatusBadgeProps) {
  let label = status;
  let colorClass = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';

  if (type === 'request') {
    label = REQUEST_STATUSES[status as keyof typeof REQUEST_STATUSES] || status;
    switch (status) {
      case 'new':
        colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        break;
      case 'contacting_hotels':
        colorClass = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
        break;
      case 'offer_found':
        colorClass = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
        break;
      case 'waiting_payment':
        colorClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
        break;
      case 'booked':
        colorClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
        break;
      case 'cancelled':
      case 'expired':
      case 'failed':
        colorClass = 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
        break;
    }
  } else if (type === 'booking') {
    label = BOOKING_STATUSES[status as keyof typeof BOOKING_STATUSES] || status;
    switch (status) {
      case 'created':
      case 'checkin_pending':
        colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        break;
      case 'waiting_payment':
        colorClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
        break;
      case 'payment_confirmed':
      case 'confirmed':
      case 'voucher_sent':
      case 'checkin_confirmed':
        colorClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
        break;
      case 'cancelled':
      case 'disputed':
      case 'refunded':
        colorClass = 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
        break;
    }
  } else if (type === 'payment') {
    label = PAYMENT_STATUSES[status as keyof typeof PAYMENT_STATUSES] || status;
    switch (status) {
      case 'pending':
        colorClass = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
        break;
      case 'received':
        colorClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
        break;
      case 'failed':
      case 'refunded':
      case 'blocked':
        colorClass = 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
        break;
    }
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
      {label}
    </span>
  );
}
