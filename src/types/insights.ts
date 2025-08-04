
export interface FinancialInsight {
  id: string;
  type: 'trend' | 'alert' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  value?: number;
  change?: number;
  severity: 'low' | 'medium' | 'high';
  category?: string;
  period: string;
  createdAt: Date;
}

export interface TrendAnalysis {
  period: string;
  revenues: number;
  expenses: number;
  balance: number;
  growth_rate: number;
  category_breakdown: CategoryTrend[];
}

export interface CategoryTrend {
  category_id: number;
  category_name: string;
  current_amount: number;
  previous_amount: number;
  change_percentage: number;
  trend_direction: 'up' | 'down' | 'stable';
}

export interface FinancialKPI {
  name: string;
  value: number;
  target?: number;
  unit: 'currency' | 'percentage' | 'count';
  trend: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface SpendingPattern {
  pattern_type: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  category_id: number;
  average_amount: number;
  peak_periods: string[];
  recommendations: string[];
}
