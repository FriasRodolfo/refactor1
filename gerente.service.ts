export interface PeriodRangeItem {
  monthKey: string;
  weekIndex: number;
  rangeStartTime: number;
  rangeEndTime: number;
}

export const filterItemsByPeriodAndWeeks = <T extends PeriodRangeItem>(
  items: T[],
  periodoStartTime: number | null,
  periodoEndTime: number | null,
  selectedMonth: string,
  selectedWeeksSet: Set<number>,
  shouldFilterByWeeks: boolean,
) =>
  items.filter((item) => {
    const matchesDateRange =
      periodoStartTime === null || periodoEndTime === null
        ? true
        : item.rangeStartTime <= periodoEndTime &&
          item.rangeEndTime >= periodoStartTime;

    const matchesSelectedWeeks = shouldFilterByWeeks
      ? item.monthKey === selectedMonth &&
        selectedWeeksSet.has(item.weekIndex - 1)
      : true;

    return matchesDateRange && matchesSelectedWeeks;
  });

export interface MonthlyGrowthInputItem {
  fecha?: string;
  total?: number;
  monto?: number;
  activo?: number;
  estado?: string;
}

interface MonthlyGrowthRow {
  dateObj: Date;
  label: string;
  ingresos: number;
  gastos: number;
  utilidad: number;
  variacion: number;
  hasPrevious: boolean;
  isNegative: boolean;
}

export const buildMonthlyGrowthRows = (
  ventasRaw: MonthlyGrowthInputItem[],
  gastosRaw: MonthlyGrowthInputItem[],
  fechaInicio: string,
  fechaFin: string,
  parseDateInput: (value: string) => Date | null,
  capitalize: (value: string) => string,
): MonthlyGrowthRow[] => {
  const groups = new Map<
    string,
    {
      dateObj: Date;
      label: string;
      ingresos: number;
      gastos: number;
    }
  >();

  if (fechaInicio && fechaFin) {
    const start = new Date(parseDateInput(fechaInicio) || new Date());
    const end = new Date(parseDateInput(fechaFin) || new Date());
    start.setDate(1);
    const current = new Date(start);

    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const key = `${year}-${String(month + 1).padStart(2, "0")}`;

      groups.set(key, {
        dateObj: new Date(current),
        label: `${capitalize(
          current.toLocaleDateString("es-MX", { month: "long", timeZone: "UTC" }),
        )} ${year}`,
        ingresos: 0,
        gastos: 0,
      });
      current.setMonth(current.getMonth() + 1);
    }
  }

  const getMonthKey = (dateStr: string) => {
    const d = new Date(dateStr);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    return `${year}-${String(month + 1).padStart(2, "0")}`;
  };

  ventasRaw.forEach((v) => {
    if (!v.fecha || v.activo === 0 || v.estado === "COTIZACION") return;
    const key = getMonthKey(v.fecha);
    if (groups.has(key)) groups.get(key)!.ingresos += Number(v.total || 0);
  });

  gastosRaw.forEach((g) => {
    if (!g.fecha) return;
    const key = getMonthKey(g.fecha);
    if (groups.has(key)) groups.get(key)!.gastos += Number(g.monto || 0);
  });

  const sortedMonths = Array.from(groups.values()).sort(
    (a, b) => a.dateObj.getTime() - b.dateObj.getTime(),
  );

  return sortedMonths.map((curr, index) => {
    const utilidad = curr.ingresos - curr.gastos;
    const isNegative = utilidad < 0;

    let variacion = 0;
    let hasPrevious = false;

    if (index > 0) {
      const prev = sortedMonths[index - 1];
      const prevUtilidad = prev.ingresos - prev.gastos;
      hasPrevious = true;

      if (prevUtilidad !== 0) {
        variacion = ((utilidad - prevUtilidad) / Math.abs(prevUtilidad)) * 100;
      } else if (utilidad !== 0) {
        variacion = utilidad > 0 ? 100 : -100;
      }
    }

    return {
      ...curr,
      utilidad,
      variacion,
      hasPrevious,
      isNegative,
    };
  });
};

export const filterActiveItemsBySelectedWeeks = <T extends { activo?: number; estado?: string; fecha?: string; fecha_devolucion?: string }>(
  items: T[],
  selectedWeeks: number[],
) => {
  if (selectedWeeks.length === 0) {
    return items.filter((item) => item.activo !== 0 && item.estado !== "COTIZACION");
  }

  return items.filter((item) => {
    if (item.activo === 0 || item.estado === "COTIZACION") return false;

    const dateVal = item.fecha || item.fecha_devolucion;
    if (!dateVal) return false;
    const date = new Date(dateVal);
    const dayOfMonth = date.getUTCDate();

    return selectedWeeks.some((weekIndex) => {
      const startDay = weekIndex * 7 + 1;
      const endDay = weekIndex === 3 ? 31 : (weekIndex + 1) * 7;
      return dayOfMonth >= startDay && dayOfMonth <= endDay;
    });
  });
};
