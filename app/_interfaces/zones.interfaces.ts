import { ManufacturingPlant } from "./manufacturing-plants.interfaces";

export interface Zone {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  manufacturingPlant: ManufacturingPlant;
}
