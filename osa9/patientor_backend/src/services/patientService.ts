import data from '../../data/patients';
import { Entry, EntryWithoutId, NewPatient, NonSensitivePatient, Patient } from '../types';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = data ;

const getPatients = (): Patient[] => {
  return patients;
};

const getSinglePatient = (id: string): Patient => {
  const patient = patients.find(n => n.id === id);
  if (!patient) {
    throw new Error('No patient matching this id was found');
  }
  return patient;
};

const getNoSsnPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id, name, dateOfBirth, gender, occupation
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const id = uuid();

  const newPatient = {
    id: id,
    ...patient
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (entry: EntryWithoutId, patientId: string): Entry => {
  const id = uuid();

  const newEntry = {
    id: id,
    ...entry
  };

  patients.find(n => n.id === patientId)?.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getSinglePatient,
  getNoSsnPatients,
  addPatient,
  addEntry
};