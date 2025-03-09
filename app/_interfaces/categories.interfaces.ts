import { MainType } from "./main-types.interfaces";
import { TypeManage } from "./type-manages.interfaces";
import { Zone } from "./zones.interfaces";

export interface CategoriesState {
  mainTypes: MainType[];
  zones: Zone[];
  typeManages: TypeManage[];
}
