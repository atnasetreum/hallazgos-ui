import { ManufacturingPlant } from "./manufacturing-plants.interfaces";
import { Zone } from "./zones.interfaces";

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  manufacturingPlants: ManufacturingPlant[];
  zones: Zone[];
  manufacturingPlantsCurrent: number[];
}
