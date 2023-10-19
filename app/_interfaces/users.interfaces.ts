export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  manufacturingPlants: ManufacturingPlant[];
  zones: Zones[];
}

export interface ManufacturingPlant {
  id: number;
  name: string;
  link: string;
  lat: number;
  lng: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface Zones {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
