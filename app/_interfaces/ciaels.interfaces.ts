export interface Ciael {
  id: number;
  description: string;
  eventDate: Date;
  daysOfDisability: number;
  timeWorked: number;
  usualWork: boolean;
  isDeath: boolean;
  isInside: boolean;
  monthsOfSeniority: number;
  createdAt: Date;
  manufacturingPlant: BasicEntity;
  typeOfEvent: BasicEntity;
  createdBy: BasicEntity;
  employee: Employee;
  cieDiagnosis: BasicEntity;
  accidentPosition: BasicEntity;
  zone: Zone;
  bodyPart: BasicEntity;
  atAgent: BasicEntity;
  typeOfInjury: BasicEntity;
  atMechanism: BasicEntity;
  workingDay: BasicEntity;
  typeOfLink: BasicEntity;
  machine: BasicEntity;
  associatedTask: BasicEntity;
  areaLeader: BasicEntity;
  riskFactor: BasicEntity;
  natureOfEvent: BasicEntity;
  manager: BasicEntity;
}

interface BasicEntity {
  name: string;
}

interface Employee {
  code: number;
  name: string;
  birthdate: Date;
  dateOfAdmission: Date;
  gender: BasicEntity;
}

interface Zone {
  name: string;
  area: BasicEntity;
}
