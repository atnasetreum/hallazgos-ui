export interface Employee {
  id: number;
  code: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  area: Area;
  position: Position;
}

interface Area {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Position {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
