import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import { useEffect, useState } from "react";
import { EntryFormValues, Patient, Diagnosis } from "../../types";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import DisplayEntry from "./Entry";
import AddEntryForm from "../AddEntryForm/AddEntryForm";
import axios from "axios";

const SinglePatientPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [genderIcon, setGenderIcon] = useState<JSX.Element>(< MaleIcon />);
  const [error, setError] = useState<string>();
  const id = useParams().id;
  const [diagnoses, setDiagnoses] = useState<Diagnosis[] | null>(null);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosisService.getAll();      
      setDiagnoses(diagnoses);      
    };
    void fetchDiagnoses();
  }, []);
  
  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await patientService.getSingle(id as string);
      
      setPatient(patient);
      switch (patient.gender) {
      case "male":
        setGenderIcon(< MaleIcon />);
        break;
      case "female":
        setGenderIcon(< FemaleIcon />);
        break;
      case "other":
        setGenderIcon(< TransgenderIcon />);      
      }
    };
    void fetchPatient();
  }, [id]);

  if (!patient || !id || !diagnoses) {
    return null;
  }

  const submitNewEntry = async (values: EntryFormValues): Promise<string | undefined> => {
    try {
      const entry = await patientService.createEntry(values, id);
      const updatedPatient = {...patient, entries: patient.entries.concat(entry) };
      setPatient(updatedPatient);
      return "success";
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace("Something went wrong. Error: ", "");
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };  

  return (
    <div>
      <h2>{patient.name} {genderIcon}</h2>
      <span>ssh: {patient.ssn} </span>
      <br/>
      <span>occupation: {patient.occupation} </span>
      <AddEntryForm onSubmit={submitNewEntry} setError={setError} error={error} diagnoses={diagnoses}/>
      <h3>Entries</h3>
      <div>
        {patient.entries?.map(n => (
          <div key={n.id}>
            <DisplayEntry entry={n} diagnoses={diagnoses} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SinglePatientPage;