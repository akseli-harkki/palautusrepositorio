import { Diagnosis, Entry } from "../../types";
import HealthCheckInfo from "./HealthCheckInfo";
import OccupationalHealthcareInfo from "./OccupationalHealthcareInfo";
import HospitalInfo from "./HospitalInfo";

const DisplayEntry = ({ entry, diagnoses }: { entry: Entry, diagnoses: Diagnosis[] }) => {
  switch (entry.type) {
  case "HealthCheck":
    return <HealthCheckInfo entry={entry} diagnoses={diagnoses} />;
  case "OccupationalHealthcare":
    return <OccupationalHealthcareInfo entry={entry} diagnoses={diagnoses} />;
  case "Hospital":
    return <HospitalInfo entry={entry} diagnoses={diagnoses} />;  
  }  
};

export default DisplayEntry;