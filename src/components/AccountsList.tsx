import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Account } from '@/types/organizze';
import { Building2, Wallet, PiggyBank, ChevronDown, Archive } from 'lucide-react';
import { useState } from 'react';

interface AccountsListProps {
  accounts: Account[];
  onAccountSelect?: (account: Account) => void;
  selectedPeriod?: { startDate: Date; endDate: Date };
}

export function AccountsList({ accounts, onAccountSelect, selectedPeriod }: AccountsListProps) {
  const [showArchived, setShowArchived] = useState(false);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return Building2;
      case 'savings':
        return PiggyBank;
      default:
        return Wallet;
    }
  };

  const getAccountTypeLabel = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return 'Conta Corrente';
      case 'savings':
        return 'Poupança';
      default:
        return 'Outras';
    }
  };

  // Check if account was active during the selected period
  const isAccountActiveInPeriod = (account: Account) => {
    if (!selectedPeriod || !account.archived) return true;
    
    const updatedAt = new Date(account.updated_at);
    return updatedAt > selectedPeriod.endDate;
  };

  // Separate active and archived accounts
  const activeAccounts = accounts.filter(account => !account.archived);
  const archivedAccounts = accounts.filter(account => account.archived);
  
  const renderAccount = (account: Account) => {
    const Icon = getAccountIcon(account.type);
    const isActiveInPeriod = isAccountActiveInPeriod(account);
    
    return (
      <div
        key={account.id}
        className={`flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/50 transition-all duration-200 cursor-pointer hover:shadow-card ${
          !isActiveInPeriod ? 'opacity-60' : ''
        }`}
        onClick={() => onAccountSelect?.(account)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground">{account.name}</h4>
              {account.default && (
                <Badge variant="outline" className="text-xs bg-success-light text-success border-success/30">
                  Padrão
                </Badge>
              )}
              {!isActiveInPeriod && (
                <Badge variant="outline" className="text-xs bg-warning-light text-warning border-warning/30">
                  Inativa no período
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {getAccountTypeLabel(account.type)}
            </p>
            {/* Show account balance */}
            {account.balance_cents !== undefined && (
              <p className="text-sm font-medium text-foreground">
                Saldo: {formatCurrency(account.balance_cents)}
              </p>
            )}
            {account.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {account.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <Badge 
            variant={account.archived ? "destructive" : "secondary"}
            className="text-xs"
          >
            {account.archived ? 'Arquivada' : 'Ativa'}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6 shadow-card bg-gradient-card border-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Contas Bancárias</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            {activeAccounts.length} ativa{activeAccounts.length !== 1 ? 's' : ''}
          </Badge>
          {archivedAccounts.length > 0 && (
            <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
              {archivedAccounts.length} arquivada{archivedAccounts.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Active accounts */}
        {activeAccounts.map(renderAccount)}

        {/* Archived accounts (collapsible) */}
        {archivedAccounts.length > 0 && (
          <Collapsible open={showArchived} onOpenChange={setShowArchived}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-border/50 bg-muted/30 hover:bg-muted/50 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Contas Arquivadas ({archivedAccounts.length})
                  </span>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                    showArchived ? 'rotate-180' : ''
                  }`} 
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3">
              {archivedAccounts.map(renderAccount)}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <Wallet className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Nenhuma conta bancária encontrada
          </p>
        </div>
      )}
    </Card>
  );
}
