
import { Check, Truck, Package, ShoppingBag, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface OrderTimelineProps {
  status: string;
  history?: {
    placed?: string;
    paid?: string;
    shipped?: string;
    outForDelivery?: string;
    delivered?: string;
  };
}

export function OrderTimeline({ status, history }: OrderTimelineProps) {
  const steps = [
    {
      id: 'placed',
      label: 'Order Placed',
      icon: ShoppingBag,
      date: history?.placed,
      isCompleted: !!history?.placed,
    },
    {
        id: 'processing',
        label: 'Processing',
        icon: Package,
        date: history?.paid, // Usually processing starts after payment
        isCompleted: status === 'Processing' || status === 'Shipped' || status === 'Out for Delivery' || status === 'Delivered',
    },
    {
      id: 'shipped',
      label: 'Shipped',
      icon: Truck,
      date: history?.shipped,
      isCompleted: !!history?.shipped || status === 'Shipped' || status === 'Out for Delivery' || status === 'Delivered',
    },
    {
      id: 'outForDelivery',
      label: 'Out for Delivery',
      icon: MapPin,
      date: history?.outForDelivery,
      isCompleted: !!history?.outForDelivery || status === 'Out for Delivery' || status === 'Delivered',
    },
    {
      id: 'delivered',
      label: 'Delivered',
      icon: Check,
      date: history?.delivered,
      isCompleted: !!history?.delivered || status === 'Delivered',
    },
  ];

  /* 
     Current Step Logic:
     Find the last completed step index.
  */
  const currentStepIndex = steps.reduce((acc, step, index) => {
      return step.isCompleted ? index : acc;
  }, 0);


  return (
    <div className="w-full py-6">
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full">
        {/* Progress Bar Background (Desktop) */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 hidden md:block -z-10" />
        
        {/* Progress Bar Foreground (Desktop) */}
        <div 
            className="absolute top-5 left-0 h-1 bg-green-500 hidden md:block -z-10 transition-all duration-500" 
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = step.isCompleted;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-2 mb-6 md:mb-0 w-full md:w-auto">
              {/* Icon Circle */}
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-300",
                  isCompleted ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300 text-gray-400",
                  isCurrent && !isCompleted && "border-blue-500 text-blue-500" // Should ideally be completed if current logic holds
                )}
              >
                <step.icon className="w-5 h-5" />
              </div>

              {/* Text */}
              <div className="flex flex-col md:items-center">
                <span className={cn(
                    "font-medium text-sm",
                    isCompleted ? "text-green-600" : "text-gray-500"
                )}>
                  {step.label}
                </span>
                {step.date && (
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(step.date), 'MMM d, h:mm a')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
