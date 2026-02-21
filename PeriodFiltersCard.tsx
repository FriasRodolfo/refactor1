import { CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PeriodFiltersCardProps {
  fechaInicio: string;
  fechaFin: string;
  selectedMonth: string;
  selectedWeeks: number[];
  monthOptions: { value: string; label: string }[];
  weekOptions: { value: number; label: string }[];
  onFechaInicioChange: (value: string) => void;
  onFechaFinChange: (value: string) => void;
  onMonthSelect: (value: string) => void;
  onWeekSelect: (value: number) => void;
}

export default function PeriodFiltersCard({
  fechaInicio,
  fechaFin,
  selectedMonth,
  selectedWeeks,
  monthOptions,
  weekOptions,
  onFechaInicioChange,
  onFechaFinChange,
  onMonthSelect,
  onWeekSelect,
}: PeriodFiltersCardProps) {
  return (
    <Card
      className="border border-orange-200/60 bg-orange-50/50 shadow-sm"
      data-guide="config-periodo"
    >
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white p-2 shadow-sm">
            <CalendarRange className="h-5 w-5 text-orange-500" />
          </span>
          <div>
            <CardTitle className="text-lg font-semibold text-orange-600">
              Configuración del periodo
            </CardTitle>
            <CardDescription>
              Ajusta el mes y las semanas para actualizar el resumen financiero.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
          <div className="flex flex-col gap-1 md:w-48" data-guide="input-fecha-inicio">
            <span className="text-sm font-medium text-muted-foreground">Fecha inicio</span>
            <Input
              type="date"
              value={fechaInicio}
              max={fechaFin}
              onChange={(event) => onFechaInicioChange(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 md:w-48" data-guide="input-fecha-fin">
            <span className="text-sm font-medium text-muted-foreground">Fecha fin</span>
            <Input
              type="date"
              value={fechaFin}
              min={fechaInicio}
              onChange={(event) => onFechaFinChange(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 md:w-60" data-guide="select-mes">
            <span className="text-sm font-medium text-muted-foreground">Seleccionar mes</span>
            <Select value={selectedMonth} onValueChange={onMonthSelect}>
              <SelectTrigger className="w-full bg-white border border-slate-200 shadow-sm transition-all hover:border-orange-300 focus:ring-2 focus:ring-orange-100">
                <SelectValue placeholder="Seleccionar periodo" />
              </SelectTrigger>
              <SelectContent
                className="bg-white border border-slate-100 shadow-xl rounded-lg z-[100] max-h-[250px] overflow-hidden"
                position="popper"
                side="bottom"
                align="start"
                sideOffset={5}
              >
                <div className="overflow-y-auto max-h-[240px] p-1 custom-scrollbar">
                  {monthOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="cursor-pointer rounded-md py-2 px-3 text-sm text-slate-600 focus:bg-orange-50 focus:text-orange-700 data-[state=checked]:bg-orange-50 data-[state=checked]:text-orange-800 data-[state=checked]:font-semibold transition-colors mb-1"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1" data-guide="select-semanas">
            <span className="text-sm font-medium text-muted-foreground">Semanas del mes</span>
            <div className="flex flex-wrap gap-2">
              {weekOptions.map((week) => (
                <Button
                  key={week.value}
                  type="button"
                  variant={selectedWeeks.includes(week.value) ? "default" : "outline"}
                  onClick={() => onWeekSelect(week.value)}
                >
                  {week.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
