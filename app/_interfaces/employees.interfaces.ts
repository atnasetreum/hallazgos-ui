import { ManufacturingPlant } from "./manufacturing-plants.interfaces";
import { TrainingGuideEmployee } from "./training-guides.interfaces";

export interface Employee {
  id: number;
  code: number;
  name: string;
  birthdate: Date | null;
  dateOfAdmission: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  area: Area;
  position: Area;
  gender: Area;
  manufacturingPlants: ManufacturingPlant[];
  trainingGuides: TrainingGuideEmployee[];
}

interface Area {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CatalogEmployee {
  areas: Area[];
  positions: Area[];
  manufacturingPlants: ManufacturingPlant[];
  genres: Area[];
}
