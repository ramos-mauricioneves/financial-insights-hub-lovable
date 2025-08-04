
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FinancialInsight, FinancialKPI } from '@/types/insights';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  Target,
  Activity,
  Calculator
} from 'lucide-react';

interface InsightsDashboardProps {
  insights: FinancialInsight[];
  kpis: FinancialKPI[];
}

export function InsightsDashboard({ insights, kpis }: InsightsDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };

  const getInsightIcon = (type: FinancialInsight['type']) => {
    switch (type) {
      case 'trend':
        return TrendingUp;
      case 'alert':
        return AlertTriangle;
      case 'achievement':
        return CheckCircle;
      case 'recommendation':
        return Lightbulb;
      default:
        return Activity;
    }
  };

  const getInsightColor = (type: FinancialInsight['type'], severity: string) => {
    switch (type) {
      case 'achievement':
        return 'bg-success/10 text-success border-success/30';
      case 'alert':
        return severity === 'high' 
          ? 'bg-destructive/10 text-destructive border-destructive/30'
          : 'bg-warning/10 text-warning border-warning/30';
      case 'recommendation':
        return 'bg-primary/10 text-primary border-primary/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getKPIIcon = (name: string) => {
    switch (name) {
      case 'Taxa de Poupança':
        return Target;
      case 'Número de Transações':
        return Activity;
      case 'Ticket Médio de Gastos':
        return Calculator;
      default:
        return TrendingUp;
    }
  };

  const formatKPIValue = (kpi: FinancialKPI) => {
    switch (kpi.unit) {
      case 'currency':
        return formatCurrency(kpi.value);
      case 'percentage':
        return `${kpi.value.toFixed(1)}%`;
      case 'count':
        return kpi.value.toString();
      default:
        return kpi.value.toString();
    }
  };

  const getKPITrendColor = (trend: string, value: number, target?: number) => {
    if (trend === 'positive' || (target && value >= target)) {
      return 'text-success';
    } else if (trend === 'negative') {
      return 'text-destructive';
    }
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* KPIs Section */}
      <Card className="p-6 shadow-card bg-gradient-card border-0">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Indicadores de Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = getKPIIcon(kpi.name);
            return (
              <div
                key={index}
                className="p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                  {kpi.target && (
                    <Badge variant="outline" className="text-xs">
                      Meta: {kpi.unit === 'percentage' ? `${kpi.target}%` : kpi.target}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{kpi.name}</p>
                  <p className={`text-lg font-bold ${getKPITrendColor(kpi.trend, kpi.value, kpi.target)}`}>
                    {formatKPIValue(kpi)}
                  </p>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Insights Section */}
      <Card className="p-6 shadow-card bg-gradient-card border-0">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Insights Financeiros
        </h3>
        
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Não há insights suficientes para o período selecionado
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.slice(0, 6).map((insight) => {
              const Icon = getInsightIcon(insight.type);
              
              return (
                <div
                  key={insight.id}
                  className="flex items-start space-x-3 p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/30 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getInsightColor(insight.type, insight.severity)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{insight.title}</h4>
                      <div className="flex items-center gap-2">
                        {insight.change && (
                          <div className={`flex items-center gap-1 ${
                            insight.change > 0 ? 'text-destructive' : 'text-success'
                          }`}>
                            {insight.change > 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            <span className="text-xs font-medium">
                              {Math.abs(insight.change).toFixed(1)}%
                            </span>
                          </div>
                        )}
                        <Badge 
                          variant={insight.severity === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {insight.severity === 'high' ? 'Alto' : 
                           insight.severity === 'medium' ? 'Médio' : 'Baixo'}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                    
                    {insight.value && (
                      <p className="text-sm font-medium text-foreground">
                        Valor: {formatCurrency(insight.value)}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {insight.category && (
                        <span>Categoria: {insight.category}</span>
                      )}
                      <span>•</span>
                      <span>Período: {insight.period}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
