import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Account } from '@/types/organizze';
import { Building2, Wallet, PiggyBank } from 'lucide-react';

interface AccountsListProps {
  accounts: Account[];
  onAccountSelect?: (account: Account) => void;
}

export function AccountsList({ accounts, onAccountSelect }: AccountsListProps) {
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

  return (
    <Card className="p-6 shadow-card bg-gradient-card border-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Contas Bancárias</h3>
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          {accounts.length} conta{accounts.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-3">
        {accounts.map((account) => {
          const Icon = getAccountIcon(account.type);
          
          return (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/50 transition-all duration-200 cursor-pointer hover:shadow-card"
              onClick={() => onAccountSelect?.(account)}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{account.name}</h4>
                    {account.default && (
                      <Badge variant="outline" className="text-xs bg-success-light text-success border-success/30">
                        Padrão
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getAccountTypeLabel(account.type)}
                  </p>
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
        })}
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