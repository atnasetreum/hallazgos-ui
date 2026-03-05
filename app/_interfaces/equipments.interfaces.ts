import { ManufacturingPlant } from "./manufacturing-plants.interfaces";
import { User } from "./users.interfaces";

export interface Equipment {
  id: number;
  name: string;
  deliveryFrequency: number | null;
  isActive: boolean;
  createdBy: User;
  createdAt: Date;
  updatedBy: User;
  updatedAt: Date;
  costHistory: CostHistory[];
  manufacturingPlant: ManufacturingPlant;
}

interface CostHistory {
  id: number;
  price: string;
  captureDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
