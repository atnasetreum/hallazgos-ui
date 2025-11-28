export interface ICSData {
  id: number;
  description: string;
  imgEvidence: string;
  numberPeopleObserved: number;
  icsPercentage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: CreatedBy;
  manufacturingPlant: ManufacturingPlant;
  ruleOfLife: AreaOfBehavior;
  standardOfBehavior: AreaOfBehavior | null;
  areaOfBehavior: AreaOfBehavior | null;
  employees: Employee[];
}

interface AreaOfBehavior {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  order?: number;
}

interface CreatedBy {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Employee {
  id: number;
  code: number;
  name: string;
  birthdate: Date;
  dateOfAdmission: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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

export interface CatalogICS {
  id: number;
  name: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  standards: Standard[];
}

interface Standard {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  areas?: Standard[];
}
