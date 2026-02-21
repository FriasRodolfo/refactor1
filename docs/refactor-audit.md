# Auditoría de `page.tsx` para refactor

## 1) Componentes utilizados (UI y funcionales)

### Componentes de UI base (shadcn/ui)
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`
- `Input`, `Button`, `Badge`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`

### Componentes de negocio / visualización
- `GuideArrowOverlay`
- `GuideModal`
- `SimpleBarChart`
- `SimplePieChart`
- `SimpleRadarChart`
- `WeeklyComparisonChart`
- `GerenteChatDialog`

### Íconos usados (lucide)
- `BookOpen`, `ChevronDown`, `Video`, `PlayCircle`
- `TrendingUp`, `ShoppingCart`, `Wallet`, `ArrowDownCircle`, `BarChart3`, `Activity`, `RotateCcw`, `FileText`, `Percent`, `AlertTriangle`, `Crown`, `Users`, `Lightbulb`, `CalendarRange`

---

## 2) Secciones HTML/JSX principales (vista)

La UI está estructurada por pestañas (`TabsContent`) dentro de una sola página monolítica:

1. **Resumen financiero** (`value="resumen"`)
2. **Rendimiento comercial** (`value="rendimiento"`)
3. **Análisis** (`value="analisis"`)
4. **Inventario** (`value="inventario"`)
5. **KPIs** (`value="kpis"`)
6. **Alertas** (`value="alertas"`)

Además de estas pestañas, hay bloques transversales:
- encabezado y acciones globales,
- guía interactiva (`GuideArrowOverlay` + `GuideModal`),
- chat de gerente (`GerenteChatDialog`).

---

## 3) Secciones de cálculos pesados / alta carga cognitiva

Estas zonas concentran lógica de transformación y agregación de datos (múltiples `useMemo`, filtros, reducciones y series para gráficas):

1. **Normalización y utilidades financieras**
   - formateo de moneda,
   - cálculo de utilidad neta diaria,
   - generación de tabla financiera.

2. **Rango temporal y calendario**
   - helpers de fechas (inicio/fin de semana, parsing, rangos por mes),
   - sincronización de fechas seleccionadas y periodo activo.

3. **Agregación semanal/mensual**
   - comparativas por semana,
   - filtrado por periodo,
   - consolidación de gastos, devoluciones, descuentos.

4. **Construcción de datasets para charts**
   - bar/pie/radar,
   - crecimiento mensual,
   - top clientes/productos,
   - resumen ejecutivo.

5. **Carga y combinación de fuentes remotas**
   - múltiples `useEffect` para llamadas HTTP,
   - acoplamiento entre fetch y cálculos derivados.

---

## 4) Propuesta de separación para refactor

> Objetivo: reducir tamaño del archivo principal, aislar responsabilidades y mejorar mantenibilidad/testeo.

### Estructura propuesta

```txt
app/
  gerente/
    page.tsx                     # composición final
    _components/
      GerenteHeader.tsx
      FinancialSummaryTab.tsx
      PerformanceTab.tsx
      AnalysisTab.tsx
      InventoryTab.tsx
      KpisTab.tsx
      AlertsTab.tsx
      GuideLayer.tsx
    _hooks/
      useGerenteData.ts          # fetch centralizado + estados de carga/error
      useDateRange.ts            # lógica de fechas y periodos
      useFinancialMetrics.ts     # cálculos financieros derivados
      useComparatives.ts         # comparativas semanales/mensuales
    _lib/
      formatters.ts              # currency, porcentaje, labels
      date.ts                    # helpers de fecha puros
      calculators.ts             # funciones puras de negocio
      adapters.ts                # transformar API -> modelo de vista
    _config/
      guideFlows.ts              # GUIDE_FLOW_*
      quickAlerts.ts             # definiciones de alertas
    _types/
      gerente.types.ts           # interfaces y tipos de dominio
```

### Reglas de corte sugeridas

1. **Tipos fuera de la vista**
   - mover interfaces a `_types/gerente.types.ts`.

2. **Config fuera de la vista**
   - mover guías y catálogos de alertas a `_config/`.

3. **Lógica de fechas y cálculo puro fuera de React**
   - pasar funciones utilitarias a `_lib/date.ts` y `_lib/calculators.ts`.

4. **Derivados `useMemo` agrupados en hooks temáticos**
   - `useFinancialMetrics`, `useComparatives`, `useDateRange`.

5. **Cada pestaña en un componente independiente**
   - la página solo orquesta estado y props mínimas.

---

## 5) Orden recomendado de ejecución del refactor (incremental)

1. Extraer **tipos** (`_types`).
2. Extraer **helpers puros** de fecha y formato (`_lib`).
3. Extraer **configuración** de guías/alertas (`_config`).
4. Dividir **Tabs** en componentes (`_components/*Tab.tsx`).
5. Crear hooks de negocio (`_hooks`) para sacar `useMemo/useEffect` del `page.tsx`.
6. Añadir pruebas unitarias para `_lib/calculators.ts` y `_lib/date.ts`.

---

## 6) Resultado esperado

- `page.tsx` reducido a capa de composición.
- Menor acoplamiento entre UI, fetch y cálculo.
- Reuso de lógica en hooks y funciones puras.
- Mejor testabilidad y menor riesgo al cambiar reglas financieras.

---

## 7) ¿Qué HTML/JSX conviene convertir en componentes ya mismo?

A continuación, una lista **accionable** de bloques que hoy están en `page.tsx` y que conviene extraer primero.

1. **Capa de guía (overlay + modal)**
   - Bloque: render condicional de `GuideArrowOverlay` y `GuideModal`.
   - Componente sugerido: `GuideLayer.tsx`.
   - Props mínimas: `guideActive`, `currentSteps`, `currentStepIndex`, `onNext`, `onPrev`, `onClose`.

2. **Header del panel (título + chat)**
   - Bloque: contenedor con título “Panel del Gerente” + `GerenteChatDialog`.
   - Componente sugerido: `GerenteHeader.tsx`.
   - Props mínimas: `chatOpen`, `chatHelpOpen`, `setChatOpen`, `setChatHelpOpen`.

3. **Menú de guía interactiva (dropdown manual)**
   - Bloque: botón `Guía Interactiva` y lista de botones de recorridos.
   - Componente sugerido: `InteractiveGuideMenu.tsx`.
   - Props mínimas: `show`, `onToggle`, `onStartGuide`.

4. **Menú de video tutorial**
   - Bloque: botón `Guía Rápida` + dropdown para abrir YouTube.
   - Componente sugerido: `VideoGuideMenu.tsx`.
   - Props mínimas: `show`, `onToggle`, `videoUrl`.

5. **Barra de navegación de pestañas**
   - Bloque: `TabsList` + todos los `TabsTrigger`.
   - Componente sugerido: `GerenteTabsNav.tsx`.
   - Props mínimas: `activeTab`, `onTabChange`.

6. **Configuración de periodo (tarjeta de filtros)**
   - Bloque: card “Configuración del periodo” con inputs/select de fechas y semanas.
   - Componente sugerido: `PeriodFiltersCard.tsx`.
   - Props mínimas: `fechaInicio`, `fechaFin`, `selectedMonth`, `selectedWeeks`, handlers.

7. **Cada `TabsContent` como componente independiente**
   - Bloques: `resumen`, `rendimiento`, `analisis`, `inventario`, `kpis`, `alertas`.
   - Componentes sugeridos: `FinancialSummaryTab.tsx`, `PerformanceTab.tsx`, `AnalysisTab.tsx`, `InventoryTab.tsx`, `KpisTab.tsx`, `AlertsTab.tsx`.
   - Props: solo datos derivados del tab para evitar pasar todo el estado global.

8. **Tarjetas KPI repetitivas**
   - Bloque: cards de métricas con icono + valor + descripción.
   - Componente sugerido: `MetricCard.tsx`.
   - Props mínimas: `title`, `value`, `description`, `icon`, `trend`, `tone`.

9. **Bloques de alertas listadas**
   - Bloque: render de alertas rápidas/gerenciales con severidad.
   - Componente sugerido: `AlertsList.tsx` y/o `AlertItem.tsx`.
   - Props mínimas: `alerts`, `onAction`.

10. **Bloques de gráficas con encabezado estándar**
    - Bloque: card + título + descripción + gráfico (`SimpleBarChart`, `SimplePieChart`, `SimpleRadarChart`).
    - Componente sugerido: `ChartCard.tsx`.
    - Props mínimas: `title`, `description`, `children`, `emptyState`.

### Prioridad recomendada (rápido impacto)

1) `GuideLayer` + `GerenteHeader` + menús de guía/video.
2) `GerenteTabsNav` + `PeriodFiltersCard`.
3) Separación de cada `TabsContent`.
4) Abstracciones reutilizables (`MetricCard`, `ChartCard`, `AlertsList`).

Con este orden, se reduce primero el ruido de JSX y luego se encapsula la UI repetida, dejando el camino listo para mover cálculos a hooks.
