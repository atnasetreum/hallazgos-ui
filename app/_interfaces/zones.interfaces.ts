import { ManufacturingPlant } from "./manufacturing-plants.interfaces";
import { Area } from "./areas.interfaces";

export interface Zone {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  manufacturingPlant: ManufacturingPlant;
  area?: Area | null;
}
