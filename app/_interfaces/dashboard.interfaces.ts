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
