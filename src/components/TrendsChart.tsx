
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendAnalysis } from '@/types/insights';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface TrendsChartProps {
  trends: TrendAnalysis[];
}

export function TrendsChart({ trends }: TrendsChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };

  const formatMonth = (period: string) => {
    const [year, month] = period.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { 
      month: 'short', 
      year: '2-digit' 
    });
  };

  const chartData = trends.map(trend => ({
    month: formatMonth(trend.period),
    receitas: trend.revenues / 100,
    despesas: trend.expenses / 100,
    saldo: trend.balance / 100,
    period: trend.period
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'receitas' ? 'Receitas' : 
               entry.dataKey === 'despesas' ? 'Despesas' : 'Saldo'}: {formatCurrency(entry.value * 100)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calcular estatísticas
  const totalRevenues = trends.reduce((sum, t) => sum + t.revenues, 0);
  const totalExpenses = trends.reduce((sum, t) => sum + t.expenses, 0);
  const averageBalance = trends.length > 0 ? trends.reduce((sum, t) => sum + t.balance, 0) / trends.length : 0;

  const latestTrend = trends[trends.length - 1];
  const previousTrend = trends[trends.length - 2];
  
  let revenueChange = 0;
  let expenseChange = 0;
  
  if (latestTrend && previousTrend) {
    revenueChange = previousTrend.revenues > 0 
      ? ((latestTrend.revenues - previousTrend.revenues) / previousTrend.revenues) * 100 
      : 0;
    expenseChange = previousTrend.expenses > 0 
      ? ((latestTrend.expenses - previousTrend.expenses) / previousTrend.expenses) * 100 
      : 0;
  }

  return (
    <Card className="p-6 shadow-card bg-gradient-card border-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Análise de Tendências
        </h3>
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          {trends.length} período{trends.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Estatísticas resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success font-medium">Total Receitas</p>
              <p className="text-lg font-bold text-success">
                {formatCurrency(totalRevenues)}
              </p>
            </div>
            <div className={`flex items-center gap-1 text-xs ${
              revenueChange >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {revenueChange >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {revenueChange !== 0 && (
                <span>{Math.abs(revenueChange).toFixed(1)}%</span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-destructive font-medium">Total Despesas</p>
              <p className="text-lg font-bold text-destructive">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className={`flex items-center gap-1 text-xs ${
              expenseChange <= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {expenseChange <= 0 ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <TrendingUp className="w-3 h-3" />
              )}
              {expenseChange !== 0 && (
                <span>{Math.abs(expenseChange).toFixed(1)}%</span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary font-medium">Saldo Médio</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(averageBalance)}
              </p>
            </div>
            <Activity className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>

      {/* Gráfico de linhas */}
      {chartData.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="receitas" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                name="Receitas"
              />
              <Line 
                type="monotone" 
                dataKey="despesas" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                name="Despesas"
              />
              <Line 
                type="monotone" 
                dataKey="saldo" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                name="Saldo"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Dados insuficientes para análise de tendências
          </p>
        </div>
      )}
    </Card>
  );
}
