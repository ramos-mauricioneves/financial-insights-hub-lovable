
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CreditCard } from '@/types/organizze';
import { CreditCard as CreditCardIcon, ChevronDown, Archive } from 'lucide-react';
import { useState } from 'react';

interface CreditCardsListProps {
  creditCards: CreditCard[];
  onCreditCardSelect?: (creditCard: CreditCard) => void;
  selectedPeriod?: { startDate: Date; endDate: Date };
}

export function CreditCardsList({ creditCards, onCreditCardSelect, selectedPeriod }: CreditCardsListProps) {
  const [showArchived, setShowArchived] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };

  // Check if credit card was active during the selected period
  const isCardActiveInPeriod = (card: CreditCard) => {
    if (!selectedPeriod || !card.archived) return true;
    
    const updatedAt = new Date(card.updated_at);
    return updatedAt > selectedPeriod.endDate;
  };

  // Separate active and archived credit cards
  const activeCards = creditCards.filter(card => !card.archived);
  const archivedCards = creditCards.filter(card => card.archived);

  const renderCreditCard = (card: CreditCard) => {
    const isActiveInPeriod = isCardActiveInPeriod(card);
    
    return (
      <div
        key={card.id}
        className={`flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/50 transition-all duration-200 cursor-pointer hover:shadow-card ${
          !isActiveInPeriod ? 'opacity-60' : ''
        }`}
        onClick={() => onCreditCardSelect?.(card)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <CreditCardIcon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground">{card.name}</h4>
              {card.default && (
                <Badge variant="outline" className="text-xs bg-success-light text-success border-success/30">
                  Padrão
                </Badge>
              )}
              {!isActiveInPeriod && (
                <Badge variant="outline" className="text-xs bg-warning-light text-warning border-warning/30">
                  Inativo no período
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Limite: {formatCurrency(card.limit)}
            </p>
            <p className="text-xs text-muted-foreground">
              Fechamento: dia {card.closing_day} • Vencimento: dia {card.due_day}
            </p>
            {card.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <Badge 
            variant={card.archived ? "destructive" : "secondary"}
            className="text-xs"
          >
            {card.archived ? 'Arquivado' : 'Ativo'}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6 shadow-card bg-gradient-card border-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Cartões de Crédito</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            {activeCards.length} ativo{activeCards.length !== 1 ? 's' : ''}
          </Badge>
          {archivedCards.length > 0 && (
            <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
              {archivedCards.length} arquivado{archivedCards.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Active credit cards */}
        {activeCards.map(renderCreditCard)}

        {/* Archived credit cards (collapsible) */}
        {archivedCards.length > 0 && (
          <Collapsible open={showArchived} onOpenChange={setShowArchived}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-border/50 bg-muted/30 hover:bg-muted/50 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Cartões Arquivados ({archivedCards.length})
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
              {archivedCards.map(renderCreditCard)}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {creditCards.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <CreditCardIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Nenhum cartão de crédito encontrado
          </p>
        </div>
      )}
    </Card>
  );
}
