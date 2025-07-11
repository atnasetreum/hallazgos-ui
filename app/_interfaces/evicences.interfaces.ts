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
  process?: GenericType;
  user: User;
  supervisors: User[];
  responsibles: User[];
  status: string;
  imgSolution: string;
  solutionDate: Date;
  comments: Comment[];
  description: string;
}

export interface Comment {
  id: number;
  comment: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
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
