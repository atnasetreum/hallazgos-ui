import { MainType } from "./main-types.interfaces";
import { Processes } from "./processes.interfaces";
import { Zone } from "./zones.interfaces";

export interface CategoriesState {
  mainTypes: MainType[];
  zones: Zone[];
  processes: Processes[];
}
