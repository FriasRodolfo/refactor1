import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsNavigation() {
  return (
    <TabsList className="flex flex-wrap gap-2">
      <TabsTrigger value="resumen" data-guide="tab-resumen">
        Resumen Financiero Mensual
      </TabsTrigger>
      <TabsTrigger value="rendimiento" data-guide="tab-rendimiento">
        Rendimiento Comercial y Proyecciones
      </TabsTrigger>
      <TabsTrigger value="analisis" data-guide="tab-analisis">
        Análisis de Clientes y Productos
      </TabsTrigger>
      <TabsTrigger value="inventario" data-guide="tab-inventario">
        Inventario e Indicadores Operativos
      </TabsTrigger>
      <TabsTrigger value="kpis" data-guide="tab-kpis">
        Datos financieros
      </TabsTrigger>
      <TabsTrigger value="alertas" data-guide="tab-alertas">
        Alertas y sugerencias
      </TabsTrigger>
    </TabsList>
  );
}
