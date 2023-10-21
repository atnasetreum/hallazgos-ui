import { ManufacturingPlant, Zones } from "./users.interfaces";

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
  manufacturingPlantsCurrent: number[];
}
