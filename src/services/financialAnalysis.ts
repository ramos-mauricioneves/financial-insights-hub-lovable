
import { Transaction, Category } from '@/types/organizze';
import { FinancialInsight, TrendAnalysis, CategoryTrend, FinancialKPI, SpendingPattern } from '@/types/insights';

export class FinancialAnalysisService {
  static generateInsights(
    transactions: Transaction[], 
    categories: Category[], 
    previousPeriodTransactions: Transaction[] = []
  ): FinancialInsight[] {
    const insights: FinancialInsight[] = [];

    // Análise de tendências
    const trendInsights = this.analyzeTrends(transactions, previousPeriodTransactions, categories);
    insights.push(...trendInsights);

    // Análise de gastos por categoria
    const categoryInsights = this.analyzeCategorySpending(transactions, categories);
    insights.push(...categoryInsights);

    // Detecção de anomalias
    const anomalyInsights = this.detectAnomalies(transactions, categories);
    insights.push(...anomalyInsights);

    // Análise de saúde financeira
    const healthInsights = this.analyzeFinancialHealth(transactions);
    insights.push(...healthInsights);

    return insights.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private static analyzeTrends(
    current: Transaction[], 
    previous: Transaction[], 
    categories: Category[]
  ): FinancialInsight[] {
    const insights: FinancialInsight[] = [];

    const currentExpenses = current.filter(t => t.amount_cents < 0).reduce((sum, t) => sum + Math.abs(t.amount_cents), 0);
    const previousExpenses = previous.filter(t => t.amount_cents < 0).reduce((sum, t) => sum + Math.abs(t.amount_cents), 0);

    if (previous.length > 0) {
      const expenseChange = ((currentExpenses - previousExpenses) / previousExpenses) * 100;
      
      if (Math.abs(expenseChange) > 10) {
        insights.push({
          id: `trend-expenses-${Date.now()}`,
          type: expenseChange > 0 ? 'alert' : 'achievement',
          title: expenseChange > 0 ? 'Aumento nos Gastos' : 'Redução nos Gastos',
          description: `Seus gastos ${expenseChange > 0 ? 'aumentaram' : 'diminuíram'} ${Math.abs(expenseChange).toFixed(1)}% em relação ao período anterior`,
          value: currentExpenses,
          change: expenseChange,
          severity: Math.abs(expenseChange) > 20 ? 'high' : 'medium',
          period: 'monthly',
          createdAt: new Date()
        });
      }
    }

    const currentRevenues = current.filter(t => t.amount_cents > 0).reduce((sum, t) => sum + t.amount_cents, 0);
    const previousRevenues = previous.filter(t => t.amount_cents > 0).reduce((sum, t) => sum + t.amount_cents, 0);

    if (previous.length > 0 && previousRevenues > 0) {
      const revenueChange = ((currentRevenues - previousRevenues) / previousRevenues) * 100;
      
      if (Math.abs(revenueChange) > 5) {
        insights.push({
          id: `trend-revenues-${Date.now()}`,
          type: revenueChange > 0 ? 'achievement' : 'alert',
          title: revenueChange > 0 ? 'Aumento na Receita' : 'Redução na Receita',
          description: `Suas receitas ${revenueChange > 0 ? 'aumentaram' : 'diminuíram'} ${Math.abs(revenueChange).toFixed(1)}% em relação ao período anterior`,
          value: currentRevenues,
          change: revenueChange,
          severity: Math.abs(revenueChange) > 15 ? 'high' : 'medium',
          period: 'monthly',
          createdAt: new Date()
        });
      }
    }

    return insights;
  }

  private static analyzeCategorySpending(transactions: Transaction[], categories: Category[]): FinancialInsight[] {
    const insights: FinancialInsight[] = [];
    const expenses = transactions.filter(t => t.amount_cents < 0);
    
    if (expenses.length === 0) return insights;

    const categoryTotals = new Map<number, number>();
    expenses.forEach(transaction => {
      const current = categoryTotals.get(transaction.category_id) || 0;
      categoryTotals.set(transaction.category_id, current + Math.abs(transaction.amount_cents));
    });

    const totalExpenses = Array.from(categoryTotals.values()).reduce((sum, amount) => sum + amount, 0);
    
    // Encontrar categoria com maior gasto
    let maxCategoryId = 0;
    let maxAmount = 0;
    categoryTotals.forEach((amount, categoryId) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        maxCategoryId = categoryId;
      }
    });

    if (maxAmount > 0) {
      const category = categories.find(c => c.id === maxCategoryId);
      const percentage = (maxAmount / totalExpenses) * 100;
      
      if (percentage > 30) {
        insights.push({
          id: `category-dominant-${maxCategoryId}`,
          type: 'alert',
          title: 'Categoria Dominante',
          description: `${percentage.toFixed(1)}% dos seus gastos estão concentrados em ${category?.name || 'categoria desconhecida'}`,
          value: maxAmount,
          severity: percentage > 50 ? 'high' : 'medium',
          category: category?.name,
          period: 'current',
          createdAt: new Date()
        });
      }
    }

    return insights;
  }

  private static detectAnomalies(transactions: Transaction[], categories: Category[]): FinancialInsight[] {
    const insights: FinancialInsight[] = [];
    const expenses = transactions.filter(t => t.amount_cents < 0);
    
    if (expenses.length < 5) return insights;

    // Detectar transações com valores muito acima da média
    const amounts = expenses.map(t => Math.abs(t.amount_cents));
    const average = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const threshold = average * 2;

    const anomalousTransactions = expenses.filter(t => Math.abs(t.amount_cents) > threshold);
    
    if (anomalousTransactions.length > 0) {
      const totalAnomalous = anomalousTransactions.reduce((sum, t) => sum + Math.abs(t.amount_cents), 0);
      
      insights.push({
        id: `anomaly-high-spending-${Date.now()}`,
        type: 'alert',
        title: 'Gastos Atípicos Detectados',
        description: `${anomalousTransactions.length} transação(ões) com valores bem acima da sua média usual`,
        value: totalAnomalous,
        severity: 'medium',
        period: 'current',
        createdAt: new Date()
      });
    }

    return insights;
  }

  private static analyzeFinancialHealth(transactions: Transaction[]): FinancialInsight[] {
    const insights: FinancialInsight[] = [];
    
    const revenues = transactions.filter(t => t.amount_cents > 0).reduce((sum, t) => sum + t.amount_cents, 0);
    const expenses = Math.abs(transactions.filter(t => t.amount_cents < 0).reduce((sum, t) => sum + t.amount_cents, 0));
    
    if (revenues === 0) return insights;

    const savingsRate = ((revenues - expenses) / revenues) * 100;
    
    if (savingsRate > 20) {
      insights.push({
        id: `health-good-savings-${Date.now()}`,
        type: 'achievement',
        title: 'Excelente Taxa de Poupança',
        description: `Você está poupando ${savingsRate.toFixed(1)}% da sua renda. Parabéns!`,
        value: revenues - expenses,
        severity: 'low',
        period: 'current',
        createdAt: new Date()
      });
    } else if (savingsRate < 10) {
      insights.push({
        id: `health-low-savings-${Date.now()}`,
        type: 'recommendation',
        title: 'Taxa de Poupança Baixa',
        description: `Você está poupando apenas ${savingsRate.toFixed(1)}% da sua renda. Considere revisar seus gastos.`,
        value: revenues - expenses,
        severity: savingsRate < 0 ? 'high' : 'medium',
        period: 'current',
        createdAt: new Date()
      });
    }

    return insights;
  }

  static calculateKPIs(transactions: Transaction[]): FinancialKPI[] {
    const revenues = transactions.filter(t => t.amount_cents > 0).reduce((sum, t) => sum + t.amount_cents, 0);
    const expenses = Math.abs(transactions.filter(t => t.amount_cents < 0).reduce((sum, t) => sum + t.amount_cents, 0));
    const balance = revenues - expenses;
    
    const kpis: FinancialKPI[] = [
      {
        name: 'Taxa de Poupança',
        value: revenues > 0 ? ((balance / revenues) * 100) : 0,
        target: 20,
        unit: 'percentage',
        trend: balance > 0 ? 'positive' : 'negative',
        description: 'Percentual da renda que você conseguiu poupar'
      },
      {
        name: 'Número de Transações',
        value: transactions.length,
        unit: 'count',
        trend: 'neutral',
        description: 'Total de movimentações no período'
      },
      {
        name: 'Ticket Médio de Gastos',
        value: transactions.filter(t => t.amount_cents < 0).length > 0 
          ? Math.abs(expenses / transactions.filter(t => t.amount_cents < 0).length)
          : 0,
        unit: 'currency',
        trend: 'neutral',
        description: 'Valor médio por transação de despesa'
      }
    ];

    return kpis;
  }

  static generateTrendAnalysis(transactions: Transaction[], categories: Category[]): TrendAnalysis[] {
    // Agrupar transações por mês
    const monthlyData = new Map<string, Transaction[]>();
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, []);
      }
      monthlyData.get(monthKey)!.push(transaction);
    });

    const trends: TrendAnalysis[] = Array.from(monthlyData.entries()).map(([period, periodTransactions]) => {
      const revenues = periodTransactions.filter(t => t.amount_cents > 0).reduce((sum, t) => sum + t.amount_cents, 0);
      const expenses = Math.abs(periodTransactions.filter(t => t.amount_cents < 0).reduce((sum, t) => sum + t.amount_cents, 0));
      const balance = revenues - expenses;

      return {
        period,
        revenues,
        expenses,
        balance,
        growth_rate: 0, // Seria calculado comparando com período anterior
        category_breakdown: []
      };
    });

    return trends.sort((a, b) => a.period.localeCompare(b.period));
  }
}
