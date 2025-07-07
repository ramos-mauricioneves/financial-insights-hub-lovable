import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Transaction, Category, Account } from '@/types/organizze';
import { ArrowDownRight, ArrowUpRight, Calendar, CreditCard, Building2, Filter } from 'lucide-react';
import { useState } from 'react';

interface TransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  onTransactionSelect?: (transaction: Transaction) => void;
}

export function TransactionsList({ 
  transactions, 
  categories, 
  accounts, 
  onTransactionSelect 
}: TransactionsListProps) {
  console.log('TransactionsList received:', { transactions, categories, accounts });
  const [filter, setFilter] = useState<'all' | 'revenues' | 'expenses'>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(amount) / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Categoria não encontrada';
  };

  const getAccountName = (accountId: number | null) => {
    if (!accountId) return 'Cartão de Crédito';
    const account = accounts.find(a => a.id === accountId);
    return account?.name || 'Conta não encontrada';
  };

  const isRevenue = (transaction: Transaction) => {
    return transaction.amount_cents > 0;
  };

  const filteredTransactions = (transactions || []).filter(transaction => {
    if (filter === 'revenues') return isRevenue(transaction);
    if (filter === 'expenses') return !isRevenue(transaction);
    return true;
  });

  const totalRevenues = (transactions || [])
    .filter(t => isRevenue(t))
    .reduce((sum, t) => sum + t.amount_cents, 0);

  const totalExpenses = (transactions || [])
    .filter(t => !isRevenue(t))
    .reduce((sum, t) => sum + Math.abs(t.amount_cents), 0);

  return (
    <Card className="p-6 shadow-card bg-gradient-card border-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Movimentações</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            {(transactions || []).length} movimentação{(transactions || []).length !== 1 ? 'ões' : ''}
          </Badge>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="text-xs"
        >
          Todas
        </Button>
        <Button
          variant={filter === 'revenues' ? 'success' : 'outline'}
          size="sm"
          onClick={() => setFilter('revenues')}
          className="text-xs"
        >
          <ArrowUpRight className="w-3 h-3 mr-1" />
          Receitas
        </Button>
        <Button
          variant={filter === 'expenses' ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => setFilter('expenses')}
          className="text-xs"
        >
          <ArrowDownRight className="w-3 h-3 mr-1" />
          Despesas
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-success-light border border-success/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Receitas</span>
            </div>
            <span className="font-semibold text-success">
              {formatCurrency(totalRevenues)}
            </span>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-destructive-light border border-destructive/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Despesas</span>
            </div>
            <span className="font-semibold text-destructive">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
        </div>
      </div>

      {/* Transactions list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredTransactions.map((transaction) => {
          const isRevenueTransaction = isRevenue(transaction);
          
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card hover:bg-accent/50 transition-all duration-200 cursor-pointer hover:shadow-card"
              onClick={() => onTransactionSelect?.(transaction)}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`p-2 rounded-full ${
                  isRevenueTransaction 
                    ? 'bg-success/10 text-success' 
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {isRevenueTransaction ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground truncate">
                      {transaction.description}
                    </h4>
                    {!transaction.paid && (
                      <Badge variant="outline" className="text-xs bg-warning-light text-warning border-warning/30">
                        Pendente
                      </Badge>
                    )}
                    {transaction.recurring && (
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                        Recorrente
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {transaction.credit_card_id ? (
                        <CreditCard className="w-3 h-3" />
                      ) : (
                        <Building2 className="w-3 h-3" />
                      )}
                      <span className="truncate">
                        {getAccountName(transaction.account_id)}
                      </span>
                    </div>
                    
                    <span className="truncate">
                      {getCategoryName(transaction.category_id)}
                    </span>
                  </div>
                  
                  {transaction.total_installments > 1 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Parcela {transaction.installment} de {transaction.total_installments}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <span className={`text-lg font-semibold ${
                  isRevenueTransaction ? 'text-success' : 'text-destructive'
                }`}>
                  {isRevenueTransaction ? '+' : '-'}{formatCurrency(transaction.amount_cents)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {filter === 'all' 
              ? 'Nenhuma movimentação encontrada'
              : `Nenhuma ${filter === 'revenues' ? 'receita' : 'despesa'} encontrada`
            }
          </p>
        </div>
      )}
    </Card>
  );
}