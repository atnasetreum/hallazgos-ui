export enum ExtinguisherType {
  PQS = "PQS",
  CO2 = "CO2",
  AFFF = "AFFF",
}

export interface EmergencyTeam {
  id: number;
  location: string;
  extinguisherNumber: number;
  typeOfExtinguisher: ExtinguisherType;
  capacity: number;
  manufacturingPlant: EmergencyTeamManufacturingPlant;
  isActive: boolean;
  createdBy: EmergencyTeamUser;
  updatedBy: EmergencyTeamUser | null;
  createdAt: Date;
  updatedAt: Date;
}

interface EmergencyTeamManufacturingPlant {
  id: number;
  name: string;
}

interface EmergencyTeamUser {
  id: number;
  name: string;
  email: string;
}
