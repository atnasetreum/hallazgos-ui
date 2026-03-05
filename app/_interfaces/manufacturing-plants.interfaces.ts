export interface ManufacturingPlant {
  id: number;
  name: string;
  link: string;
  lat: number;
  lng: number;
  isActive: boolean;
  country: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
