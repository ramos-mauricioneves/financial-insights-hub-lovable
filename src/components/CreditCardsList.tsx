import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CreditCard } from '@/types/organizze';
import { CreditCard as CreditCardIcon, Calendar, ChevronDown, Archive } from 'lucide-react';
import { useState } from 'react';

interface CreditCardsListProps {
  creditCards: CreditCard[];
  onCardSelect?: (card: CreditCard) => void;
  selectedPeriod?: { startDate: Date; endDate: Date };
}

export function CreditCardsList({ creditCards, onCardSelect, selectedPeriod }: CreditCardsListProps) {
  const [showArchived, setShowArchived] = useState(false);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };

  // Mock usage data - in real app this would come from API
  const getCardUsage = (cardId: number) => {
    const mockUsage = {
      current: Math.floor(Math.random() * 80000) + 10000,
      limit: 100000
    };
    const percentage = (mockUsage.current / mockUsage.limit) * 100;
    return { ...mockUsage, percentage };
  };

  // Check if card was active during the selected period
  const isCardActiveInPeriod = (card: CreditCard) => {
    if (!selectedPeriod || !card.archived) return true;
    
    const updatedAt = new Date(card.updated_at);
    return updatedAt > selectedPeriod.endDate;
  };

  // Separate active and archived cards
  const activeCards = creditCards.filter(card => !card.archived);
  const archivedCards = creditCards.filter(card => card.archived);
  
  const renderCard = (card: CreditCard) => {
    const usage = getCardUsage(card.id);
    const isActiveInPeriod = isCardActiveInPeriod(card);
    
    return (
      <div
        key={card.id}
        className={`p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/50 transition-all duration-200 cursor-pointer hover:shadow-card ${
          !isActiveInPeriod ? 'opacity-60' : ''
        }`}
        onClick={() => onCardSelect?.(card)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <CreditCardIcon className="w-4 h-4 text-warning" />
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
              {card.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              )}
            </div>
          </div>
          
          <Badge 
            variant={card.archived ? "destructive" : "secondary"}
            className="text-xs"
          >
            {card.archived ? 'Arquivado' : 'Ativo'}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Limite utilizado</span>
            <span className="font-medium">
              {formatCurrency(usage.current)} de {formatCurrency(card.limit)}
            </span>
          </div>
          
          <Progress 
            value={usage.percentage} 
            className="h-2"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Fechamento: dia {card.closing_day}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Vencimento: dia {card.due_day}</span>
            </div>
          </div>
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

      <div className="space-y-4">
        {/* Active cards */}
        {activeCards.map(renderCard)}

        {/* Archived cards (collapsible) */}
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
            <CollapsibleContent className="space-y-4 mt-4">
              {archivedCards.map(renderCard)}
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