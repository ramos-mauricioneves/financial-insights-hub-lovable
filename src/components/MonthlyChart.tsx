import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types/organizze';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

interface MonthlyChartProps {
  transactions: Transaction[];
}

export function MonthlyChart({ transactions }: MonthlyChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(amount) / 100);
  };

  // Group transactions by month
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'short' 
    });

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthName,
        revenues: 0,
        expenses: 0,
        balance: 0,
        date: date
      };
    }

    const amount = Math.abs(transaction.amount_cents);
    if (transaction.amount_cents > 0) {
      acc[monthKey].revenues += amount;
    } else {
      acc[monthKey].expenses += amount;
    }

    acc[monthKey].balance = acc[monthKey].revenues - acc[monthKey].expenses;

    return acc;
  }, {} as Record<string, {
    month: string;
    revenues: number;
    expenses: number;
    balance: number;
    date: Date;
  }>);

  // Convert to array and sort by date
  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-12) // Show last 12 months
    .map(item => ({
      month: item.month,
      revenues: item.revenues / 100,
      expenses: item.expenses / 100,
      balance: item.balance / 100
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground capitalize">
                  {entry.dataKey === 'revenues' ? 'Receitas' : 
                   entry.dataKey === 'expenses' ? 'Despesas' : 'Saldo'}
                </span>
              </div>
              <span className="font-medium text-foreground">
                {formatCurrency(entry.value * 100)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalRevenues = chartData.reduce((sum, item) => sum + item.revenues, 0);
  const totalExpenses = chartData.reduce((sum, item) => sum + item.expenses, 0);
  const totalBalance = totalRevenues - totalExpenses;

  return (
    <Card className="p-6 shadow-card bg-gradient-card border-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Evolução Mensal</h3>
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          {chartData.length} mese{chartData.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-success-light border border-success/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {formatCurrency(totalRevenues * 100)}
            </div>
            <div className="text-sm text-success/80">Total Receitas</div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-destructive-light border border-destructive/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive mb-1">
              {formatCurrency(totalExpenses * 100)}
            </div>
            <div className="text-sm text-destructive/80">Total Despesas</div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${
          totalBalance >= 0 
            ? 'bg-success-light border-success/20' 
            : 'bg-destructive-light border-destructive/20'
        }`}>
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${
              totalBalance >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {formatCurrency(Math.abs(totalBalance) * 100)}
            </div>
            <div className={`text-sm ${
              totalBalance >= 0 ? 'text-success/80' : 'text-destructive/80'
            }`}>
              Saldo {totalBalance >= 0 ? 'Positivo' : 'Negativo'}
            </div>
          </div>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Bar 
                dataKey="revenues" 
                fill="hsl(var(--success))"
                name="Receitas"
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
              <Bar 
                dataKey="expenses" 
                fill="hsl(var(--destructive))"
                name="Despesas"
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <BarChart className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Não há dados suficientes para gerar o gráfico mensal
          </p>
        </div>
      )}
    </Card>
  );
}