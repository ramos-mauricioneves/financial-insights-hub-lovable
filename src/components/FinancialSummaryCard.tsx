import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FinancialSummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  type: 'revenue' | 'expense' | 'balance';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function FinancialSummaryCard({ 
  title, 
  value, 
  icon: Icon, 
  type,
  trend 
}: FinancialSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };

  const getCardStyles = () => {
    switch (type) {
      case 'revenue':
        return 'bg-gradient-success text-success-foreground shadow-success';
      case 'expense':
        return 'bg-destructive-light border-destructive/20 text-destructive';
      case 'balance':
        return value >= 0 
          ? 'bg-gradient-success text-success-foreground shadow-success'
          : 'bg-destructive-light border-destructive/20 text-destructive';
      default:
        return 'bg-gradient-card shadow-card';
    }
  };

  return (
    <Card className={`p-6 border-0 transition-all duration-300 hover:scale-105 ${getCardStyles()}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-2xl font-bold">{formatCurrency(value)}</p>
          {trend && (
            <div className="flex items-center text-xs opacity-75">
              <span className={trend.isPositive ? 'text-success' : 'text-destructive'}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}%
              </span>
              <span className="ml-1">vs. mês anterior</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-white/20">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}