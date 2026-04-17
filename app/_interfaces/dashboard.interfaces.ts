export interface ResponseOpenVsClosed {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

export interface ResponseAccidents {
  numeroDeMes: number;
  numeroDeEmpleados: number;
  numeroDeAccidentes: number;
  nombreMes: string;
}

export interface ResponseDashboardMultiNivel {
  statusData: StatusDatum[];
  statusSeries: StatusSery[];
}

export interface ResponseDashboardStatusByFilters {
  total: number;
  startDate: string;
  endDate: string;
  seriesData: {
    name: string;
    y: number;
  }[];
}

export interface ResponseDashboardAssignedResponsiblesByFilters {
  total: number;
  startDate: string;
  endDate: string;
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

interface StatusDatum {
  name: string;
  y: number;
  drilldown: string;
}

interface StatusSery {
  name: string;
  id: string;
  data: Array<Array<number | string>>;
}

export interface ResponseDashboardMainTypes {
  series: ResponseDashboardMainTypesSeries[];
  drilldown: Drilldown;
}

interface Drilldown {
  breadcrumbs: Breadcrumbs;
  series: DrilldownSeries[];
}

interface Breadcrumbs {
  position: Position;
}

interface Position {
  align: string;
}

interface DrilldownSeries {
  name: string;
  id: string;
  data: Array<Array<number | string>>;
}

interface ResponseDashboardMainTypesSeries {
  name: string;
  colorByPoint: boolean;
  data: DatumClass[];
}

interface DatumClass {
  name: string;
  y: number;
  drilldown: null | string;
}

export interface ResponseDashboardEvidencesByMonth {
  series: ResponseDashboardEvidencesByMonthSeries[];
  categories: string[];
}

interface ResponseDashboardEvidencesByMonthSeries {
  name: string;
  data: number[];
}

export interface ResponseTopUsersByPlant {
  data: TopUsersByPlantData[];
}

export interface TopUsersByPlantData {
  name: string;
  data: TopUsersByPlant[];
}

interface TopUsersByPlant {
  userId: number;
  username: string;
  manufacturingPlantId: number;
  manufacturingplantname: string;
  total: string;
}

export interface CriticalZone {
  planta: string;
  zona: string;
  total_abiertas: string;
  hallazgo_mas_antiguo: Date;
  max_dias_sin_resolver: number;
  promedio_dias_abierto: string;
  nuevos_este_mes: string;
  criticos_mas_90_dias: string;
  responsables: string;
}

export interface GlobalSummary {
  planta: string;
  total: string;
  abiertas: string;
  cerradas: string;
  canceladas: string;
  pct_resolucion_historica: string;
  total_mes_actual: string;
  total_mes_anterior: string;
  abiertas_mes_actual: string;
  abiertas_mes_anterior: string;
  cerradas_mes_actual: string;
  cerradas_mes_anterior: string;
  canceladas_mes_actual: string;
  canceladas_mes_anterior: string;
  pct_total: string;
  pct_abiertas: string;
  pct_cerradas: string;
  pct_canceladas: string;
}

export interface RankingOfResponsible {
  user_id: number;
  responsable: string;
  planta: string;
  total_asignadas: string;
  pendientes: string;
  cerradas: string;
  canceladas: string;
  pct_resolucion: string;
  total_mes_actual: string;
  total_mes_anterior: string;
  pendientes_mes_actual: string;
  pendientes_mes_anterior: string;
  cerradas_mes_actual: string;
  cerradas_mes_anterior: string;
  pct_carga: string;
  pct_cerradas: string;
}

export interface AverageResolution {
  planta: string;
  promedio_dias_historico: string;
  total_cerradas_historico: string;
  promedio_dias_mes_actual: string;
  total_cerradas_mes_actual: string;
  promedio_dias_mes_anterior: string;
  total_cerradas_mes_anterior: string;
  pct_cambio_promedio: string;
}

export interface MonthlyGlobalTrend {
  planta: string;
  mes: Date;
  total: string;
  abiertas: string;
  cerradas: string;
  canceladas: string;
  pct_resolucion: string;
  backlog_acumulado: string;
}

export interface MonthlyTypeTrend {
  planta: string;
  tipo_principal: string;
  total_historico: string;
  total_mes_actual: string;
  total_mes_anterior: string;
  pct_cambio: string;
}

export interface MonthlySubtypeTrend {
  planta: string;
  tipo_principal: string;
  tipo_secundario: string;
  total_historico: string;
  total_mes_actual: string;
  total_mes_anterior: string;
  pct_cambio: string;
}

export interface MyEvidences {
  total: string;
  abiertas: string;
  cerradas: string;
  canceladas: string;
  total_mes_actual: string;
  total_mes_anterior: string;
  abiertas_mes_actual: string;
  abiertas_mes_anterior: string;
  cerradas_mes_actual: string;
  cerradas_mes_anterior: string;
  canceladas_mes_actual: string;
  canceladas_mes_anterior: string;
  pct_total: string;
  pct_abiertas: string;
  pct_cerradas: string;
  pct_canceladas: string;
}

export interface OpenEvidence {
  id: number;
  description: string;
  createdAt: Date;
  tipo_principal: string;
  tipo_secundario: string;
  zona: string;
  planta: string;
  dias_abierto: number;
  responsables: null | string;
  supervisores: string;
}

export interface RecentEvidence {
  id: number;
  description: string;
  createdAt: Date;
  status: string;
  tipo_principal: string;
  tipo_secundario: string;
  zona: string;
  planta: string;
}

export interface AverageResolutionByUser {
  planta: string;
  promedio_dias_historico: string;
  minimo_dias: number;
  maximo_dias: number;
  total_cerradas_historico: string;
  promedio_dias_mes_actual: string;
  total_cerradas_mes_actual: string;
  promedio_dias_mes_anterior: string;
  total_cerradas_mes_anterior: string;
  pct_cambio_promedio: string;
}

export interface AverageResolutionByUserAssigned {
  total: string;
  abiertas: string;
  cerradas: string;
  canceladas: string;
  total_mes_actual: string;
  total_mes_anterior: string;
  abiertas_mes_actual: string;
  abiertas_mes_anterior: string;
  cerradas_mes_actual: string;
  cerradas_mes_anterior: string;
  canceladas_mes_actual: string;
  canceladas_mes_anterior: string;
  pct_total: string;
  pct_abiertas: string;
  pct_cerradas: string;
  pct_canceladas: string;
}

export interface TypeEvidenceByUser {
  tipo_principal: string;
  total_historico: string;
  total_mes_actual: string;
  total_mes_anterior: string;
  pct_cambio: string;
}

export interface PendingBySeniorityByUser {
  id: number;
  description: string;
  createdAt: Date;
  tipo_principal: string;
  tipo_secundario: string;
  zona: string;
  planta: string;
  creado_por: string;
  dias_sin_resolver: number;
}

export interface MainTypesGlobalTrend {
  id: string;
  tipo_principal: string;
  total_historico: string;
  abiertas: string;
  cerradas: string;
  canceladas: string;
  pct_resolucion_historica: string;
  total_mes_actual: string;
  total_mes_anterior: string;
  cerradas_mes_actual: string;
  cerradas_mes_anterior: string;
  abiertas_mes_actual: string;
  abiertas_mes_anterior: string;
  pct_cambio_total: string;
  pct_cambio_cerradas: string;
  pct_cambio_abiertas: string;
}

export interface MainTypesGlobalTrendDetails {
  responsable_id: number;
  responsable: string;
  total_asignadas: string;
  abiertas: string;
  cerradas: string;
  canceladas: string;
  pct_resolucion: string;
  promedio_dias_resolucion: string;
  criticos_mas_90_dias: string;
  asignadas_mes_anterior: string;
  asignadas_mes_actual: string;
  max_dias_sin_resolver: number;
}

export interface MainTypesGlobalTrendDetailsZone {
  zona: string;
  total_hallazgos: string;
  cerradas: string;
  abiertas: string;
  canceladas: string;
  pct_cumplimiento_historico: string;
  pct_cumplimiento_mes_actual: string;
  pct_cumplimiento_mes_anterior: string;
  criticos_mas_90_dias: string;
  promedio_dias_resolucion: string;
}

export interface BusinessIntelligenceEpp {
  chart1: Chart1[];
  chart2: Chart2[];
  chart3: Chart3[];
  chart4: Chart4[];
  chart5: Chart5[];
  chart6: Chart6[];
  chart7: Chart7[];
  chart8: Chart[];
  chart9: Chart9[];
  chart10: Chart[];
  promedioGlobalChart10: string;
}

interface Chart1 {
  equipment_name: string;
  gasto_mes_actual: string;
  unidades_mes_actual: string;
  gasto_mes_anterior: string;
  unidades_mes_anterior: string;
  diferencia: string;
  variacion_pct: string;
}

interface Chart {
  mes_label: string;
  mes_date: Date;
  empleados_con_entrega: string;
  gasto_total: string;
  gasto_promedio_por_empleado?: string;
  unidades_total?: string;
}

interface Chart2 {
  equipment_name: string;
  precio_actual: string;
  fecha_captura: Date;
}

interface Chart3 {
  mes_label: string;
  mes: Date;
  total_entregas: string;
  fuera_de_rango: string;
  en_rango: string;
  pct_fuera_de_rango: string;
}

interface Chart4 {
  equipment_name: string;
  unidades_mes_actual: string;
  unidades_mes_anterior: string;
  empleados_mes_actual: string;
  empleados_mes_anterior: string;
}

interface Chart5 {
  total_empleados_activos: string;
  con_entrega_mes_actual: string;
  sin_entrega_mes_actual: string;
  pct_con_entrega_actual: string;
  pct_sin_entrega_actual: string;
  con_entrega_mes_anterior: string;
  sin_entrega_mes_anterior: string;
  pct_con_entrega_anterior: string;
  pct_sin_entrega_anterior: string;
}

interface Chart6 {
  primera_vez_mes_actual: string;
  primera_vez_mes_anterior: string;
  diferencia: string;
}

interface Chart7 {
  equipment_name: string;
  empleados_nuevos_que_lo_recibieron: string;
}

interface Chart9 {
  equipment_name: string;
  gasto_total: string;
  unidades_total: string;
  pct_del_total: string;
}
