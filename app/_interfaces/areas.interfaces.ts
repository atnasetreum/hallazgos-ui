export interface Area {
  id: number;
  name: string;
  isActive: boolean;
  coordinateX?: number | null;
  coordinateY?: number | null;
  zoomLevel?: number | null;
  manufacturingPlant: {
    id: number;
    name: string;
  };
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
  updatedBy?: {
    id: number;
    name: string;
    email: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}
