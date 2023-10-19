export interface UserSession {
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

interface ManufacturingPlant {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Zones {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
