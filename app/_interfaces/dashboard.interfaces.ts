export interface DashboardStatus {
  series: DashboardStatusSeries[];
  drilldown: Drilldown;
}

interface Drilldown {
  series: DrilldownSeries[];
}

interface DrilldownSeries {
  name: string;
  id: string;
  data: Array<Array<number | string>>;
}

interface DashboardStatusSeries {
  name: string;
  colorByPoint: boolean;
  data: DatumClass[];
}

interface DatumClass {
  name: string;
  y: number;
  drilldown: null | string;
}
