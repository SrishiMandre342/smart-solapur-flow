import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Clock, CheckCircle } from 'lucide-react';

interface PaymentStatusBadgeProps {
  status: 'pending' | 'paid';
  size?: 'sm' | 'md';
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  
  if (status === 'paid') {
    return (
      <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
        <CheckCircle className={`${iconSize} mr-1`} />
        Paid
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
      <Clock className={`${iconSize} mr-1`} />
      Pending
    </Badge>
  );
};

export default PaymentStatusBadge;
