
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DateRangeFilterProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

export function DateRangeFilter({ startDate, endDate, onDateRangeChange }: DateRangeFilterProps) {
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const getPresetRanges = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    return [
      {
        label: 'Mês Atual',
        startDate: new Date(currentYear, currentMonth, 1),
        endDate: new Date(currentYear, currentMonth + 1, 0)
      },
      {
        label: 'Últimos 3 Meses',
        startDate: new Date(currentYear, currentMonth - 2, 1),
        endDate: new Date(currentYear, currentMonth + 1, 0)
      },
      {
        label: 'Últimos 6 Meses',
        startDate: new Date(currentYear, currentMonth - 5, 1),
        endDate: new Date(currentYear, currentMonth + 1, 0)
      },
      {
        label: 'Ano Atual',
        startDate: new Date(currentYear, 0, 1),
        endDate: new Date(currentYear, 11, 31)
      }
    ];
  };

  const handlePresetClick = (preset: { startDate: Date; endDate: Date }) => {
    onDateRangeChange(preset.startDate, preset.endDate);
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <Card className="p-4 shadow-card bg-gradient-card border-0">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Período de Análise</h3>
      </div>

      {/* Preset buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        {getPresetRanges().map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick(preset)}
            className="text-xs h-8"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Custom date range */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Data Inicial</label>
          <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-8 text-xs",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {startDate ? formatDate(startDate) : "Selecionar"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  if (date) {
                    onDateRangeChange(date, endDate);
                    setIsStartDateOpen(false);
                  }
                }}
                className="pointer-events-auto"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Data Final</label>
          <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-8 text-xs",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {endDate ? formatDate(endDate) : "Selecionar"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  if (date) {
                    onDateRangeChange(startDate, date);
                    setIsEndDateOpen(false);
                  }
                }}
                className="pointer-events-auto"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Current range display */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Período selecionado:</span>
          <Badge variant="secondary" className="text-xs">
            {formatDate(startDate)} - {formatDate(endDate)}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
