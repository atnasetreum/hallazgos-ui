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

interface Topic {
  id: number;
  name: string;
  duration: number;
  typeOfEvaluation: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  responsibles: Responsible[];
}

interface Responsible {
  id: number;
  code: string;
  name: string;
  birthdate: Date | null;
  dateOfAdmission: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
