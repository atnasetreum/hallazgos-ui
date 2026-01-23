import { ManufacturingPlant } from "./manufacturing-plants.interfaces";
import { User } from "./users.interfaces";

export interface ResponseTrainingGuide {
  trainingGuide: TrainingGuide;
  trainingGuideEmployee: TrainingGuideEmployee | null;
}

interface TrainingGuide {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  position: Position;
  topics: Topic[];
  areaManager: Manager;
  humanResourceManager: Manager;
}

interface Manager {
  id: number;
  name: string;
  email: string;
  role: string;
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

export interface Topic {
  id: number;
  name: string;
  duration: number;
  typeOfEvaluation: string;
  isActive: boolean;
  createdBy: User;
  createdAt: Date;
  updatedBy: User | null;
  updatedAt: Date;
  manufacturingPlants: ManufacturingPlant[];
}

/* interface Responsible {
  id: number;
  code: string;
  name: string;
  birthdate: Date | null;
  dateOfAdmission: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} */

export interface TrainingGuideEmployee {
  id: number;
  startDate: Date;
  signatureEmployee: null;
  signatureAreaManager: null;
  signatureHumanResourceManager: null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  evaluations: Evaluation[];
  areaManager: Manager;
  humanResourceManager: Manager;
  position: Position;
}

interface Evaluation {
  id: number;
  evaluationDate: Date | null;
  evaluationValue: string;
  observations: string;
  topic: Topic;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfigTg {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  topics: TopicElement[];
  position: BasicData;
  manufacturingPlant: BasicData;
  areaManager: User;
  humanResourceManager: User;
  createdBy: CreatedBy;
  updatedBy: CreatedBy | null;
}

export interface BasicData {
  id: number;
  name: string;
}

interface CreatedBy {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TopicElement {
  id: number;
  order: number;
  topic: Topic;
  responsibles: User[];
}
