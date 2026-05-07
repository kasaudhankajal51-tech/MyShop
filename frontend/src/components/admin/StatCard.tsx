import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow transition-all duration-300 bg-gradient-to-br from-card to-secondary/30", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-display font-medium text-foreground mt-2">{value}</h3>
            {trend && (
              <div className="flex items-center gap-1 mt-1">
                 <span className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded-full",
                  trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-xl bg-background shadow-sm flex items-center justify-center border border-border/50">
            <Icon className="h-6 w-6 opacity-80" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
