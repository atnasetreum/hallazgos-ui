import { MainType } from "./main-types.interfaces";

export interface SecondaryType {
  id: number;
  name: string;
  typeResponsible: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  mainType: MainType;
}
