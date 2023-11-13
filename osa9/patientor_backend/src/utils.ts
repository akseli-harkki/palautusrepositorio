import { Diagnosis, EntryWithoutId, Gender, HealthCheckRating, NewPatient } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (number: unknown): number is number => {
  return !isNaN(Number(number));
};

const parseString = (value: unknown, valueName: string): string => {
  if (!value || !isString(value)) {
    throw new Error(`Incorrect or missing ${valueName}`);
  }
  return value;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(n => n.toString()).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }
  return gender;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(Number(param));
};

const parseHealthCheckRating = (object: unknown): HealthCheckRating => {
  if (!isNumber(object) || !isHealthCheckRating(object)) {
    throw new Error('Incorrect health rating value');
  }
  return Number(object);
};

const parseDischarge = (object: unknown): { date: string, criteria: string } => {
  if ( !object || typeof object !== 'object' || !('date' in object) || !('criteria' in object)) {
    throw new Error('Discharge missing data');
  }
  if (!isString(object.date) || !isDate(object.date)) {
    throw new Error('Incorrect or missing discharge date: ' + object.date);
  }
  if (!object.criteria || !isString(object.criteria)) {
    throw new Error('Incorrect or missing discharge criteria');
  }
  return {date: object.date, criteria: object.criteria};
};

const parseSickLeave = (object: unknown): { startDate: string, endDate: string } => {
  if ( !object || typeof object !== 'object' || !('startDate' in object) || !('endDate' in object)) {
    throw new Error('SickLeave missing data');
  }
  if (!isString(object.startDate) || !isDate(object.startDate)) {
    throw new Error('Incorrect or missing sick leave start date: ' + object.startDate);
  }
  if (!isString(object.endDate) || !isDate(object.endDate)) {
    throw new Error('Incorrect or missing sick leave end date: ' + object.endDate);
  }
  return {startDate: object.startDate, endDate: object.endDate};
};

export const toNewPatient = (object: unknown): NewPatient => { 
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    const newPatient: NewPatient = {
    name: parseString(object.name, 'name'),
    ssn: parseString(object.ssn, 'ssn'),
    dateOfBirth: parseDate(object.dateOfBirth),    
    gender: parseGender(object.gender),
    occupation: parseString(object.occupation, 'occupation'),
    entries: []
    };
    return newPatient;
  }
  
  throw new Error('Incorrect data: some fields are missing');
};

export const toNewEntry = (object: unknown): EntryWithoutId => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if (!('type' in object)) {
    throw new Error('Incorrect data: type of entry is missing');
  }

  let diagnosisCodes = [];

  if (!('diagnosisCodes' in object)) {
    diagnosisCodes = [] as Array<Diagnosis['code']>;
  } else {
    diagnosisCodes = object.diagnosisCodes as Array<Diagnosis['code']>;
  }
  
  switch (object.type) {
    case 'HealthCheck':
      if ('description' in object && 'date' in object && 'specialist' in object && 'healthCheckRating' in object) {
        const newEntry: EntryWithoutId = {
        type: object.type,
        description: parseString(object.description, 'description'),
        date: parseDate(object.date),
        specialist: parseString(object.specialist, 'specialist'),
        diagnosisCodes: diagnosisCodes,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
        };
        return newEntry;
      }
      throw new Error('Incorrect data: some fields are missing');
    case 'Hospital':
      if ('description' in object && 'date' in object && 'specialist' in object && 'discharge' in object) {
        const newEntry: EntryWithoutId = {
        type: object.type,
        description: parseString(object.description, 'description'),
        date: parseDate(object.date),
        specialist: parseString(object.specialist, 'specialist'),
        diagnosisCodes: diagnosisCodes,
        discharge: parseDischarge(object.discharge)
        };
        return newEntry;
      }
      throw new Error('Incorrect data: some fields are missing');
    case 'OccupationalHealthcare':
      if ('description' in object && 'date' in object && 'specialist' in object && 'employerName' in object) {
        const newEntry: EntryWithoutId = {
        type: object.type,
        description: parseString(object.description, 'description'),
        date: parseDate(object.date),
        specialist: parseString(object.specialist, 'specialist'),
        diagnosisCodes: diagnosisCodes,
        employerName: parseString(object.employerName, 'employer name'),
        };
        if('sickLeave' in object) {
          newEntry.sickLeave = parseSickLeave(object.sickLeave);
        }
        return newEntry;
      }
      throw new Error('Incorrect data: some fields are missing');
    default:
      throw new Error('Type of entry is incorrect');
  }

};

/* export default { 
  toNewPatient, 
  toNewEntry 
} */