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
  position: Area | null;
}

interface Area {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
