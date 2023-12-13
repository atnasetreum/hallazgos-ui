export interface Evidence {
  id: number;
  imgEvidence: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  manufacturingPlant: ManufacturingPlant;
  mainType: GenericType;
  secondaryType: GenericType;
  zone: GenericType;
  user: User;
  supervisor: User;
  status: string;
  imgSolution: string;
  solutionDate: Date;
}

interface GenericType {
  id: number;
  name: string;
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

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
