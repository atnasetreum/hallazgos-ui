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
