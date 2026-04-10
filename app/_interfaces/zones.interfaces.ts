import { ManufacturingPlant } from "./manufacturing-plants.interfaces";
import { Area } from "./areas.interfaces";

export interface Zone {
  id: number;
  name: string;
  isActive: boolean;
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
  manufacturingPlant: ManufacturingPlant;
  area?: Area | null;
}
