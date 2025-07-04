import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction, Category } from '@/types/organizze';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoriesChartProps {
  transactions: Transaction[];
  categories: Category[];
  type: 'expenses' | 'revenues';
}

export function CategoriesChart({ transactions, categories, type }: CategoriesChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(amount) / 100);
  };

  // Filter transactions by type (expenses are negative, revenues are positive)
  const filteredTransactions = transactions.filter(transaction => 
    type === 'expenses' ? transaction.amount_cents < 0 : transaction.amount_cents > 0
  );

  // Group transactions by category
  const categoryData = categories.reduce((acc, category) => {
    const categoryTransactions = filteredTransactions.filter(t => t.category_id === category.id);
    const totalAmount = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount_cents), 0);
    
    if (totalAmount > 0) {
      acc.push({
        name: category.name,
        value: totalAmount,
        color: category.color || '#8B5CF6',
        transactions: categoryTransactions.length
      });
    }
    
    return acc;
  }, [] as Array<{
    name: string;
    value: number;
    color: string;
    transactions: number;
  }>);

  // Sort by value and get top categories
  const sortedData = categoryData
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Show top 8 categories

  const totalAmount = sortedData.reduce((sum, item) => sum + item.value, 0);

  // Generate colors for categories that don't have one
  const colors = [
    '#16A34A', '#DC2626', '#CA8A04', '#9333EA', 
    '#C2410C', '#BE123C', '#7C3AED', '#0891B2'
  ];

  const chartData = sortedData.map((item, index) => ({
    ...item,
    color: item.color.startsWith('#') ? item.color : colors[index % colors.length],
    percentage: ((item.value / totalAmount) * 100).toFixed(1)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)} ({data.percentage}%)
          </p>
          <p className="text-xs text-muted-foreground">
            {data.transactions} transação{data.transactions !== 1 ? 'ões' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 shadow-card bg-gradient-card border-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Análise por Categoria - {type === 'expenses' ? 'Despesas' : 'Receitas'}
        </h3>
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          {chartData.length} categoria{chartData.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Categories List */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground mb-4">
              Total: {formatCurrency(totalAmount)}
            </h4>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {chartData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <span className="font-medium text-foreground">{item.name}</span>
                      <div className="text-xs text-muted-foreground">
                        {item.transactions} transação{item.transactions !== 1 ? 'ões' : ''}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {formatCurrency(item.value)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <PieChart className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Não há {type === 'expenses' ? 'despesas' : 'receitas'} para analisar
          </p>
        </div>
      )}
    </Card>
  );
}