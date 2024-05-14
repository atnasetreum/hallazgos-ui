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
