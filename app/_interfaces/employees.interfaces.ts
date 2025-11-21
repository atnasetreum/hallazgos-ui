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

interface ManufacturingPlant {
  id: number;
  name: string;
  link: string;
  lat: string;
  lng: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
