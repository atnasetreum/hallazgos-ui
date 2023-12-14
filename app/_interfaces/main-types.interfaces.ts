import { SecondaryType } from "./secondary-types.interfaces";

export interface MainType {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  secondaryTypes: SecondaryType[];
}
