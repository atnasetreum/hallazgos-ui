export interface Area {
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
}
