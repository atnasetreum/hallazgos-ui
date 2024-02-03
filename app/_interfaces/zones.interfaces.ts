import { ManufacturingPlant } from "./users.interfaces";

export interface Zone {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  manufacturingPlant: ManufacturingPlant;
}
