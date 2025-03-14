import { ManufacturingPlant } from "./manufacturing-plants.interfaces";

export interface Processes {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  manufacturingPlant: ManufacturingPlant;
}
