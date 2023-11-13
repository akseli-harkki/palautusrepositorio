import { Diagnosis, OccupationalHealthcareEntry } from "../../types";
import Paper from "@mui/material/Paper";
import WorkIcon from "@mui/icons-material/Work";

const OccupationalHealthcareInfo = ({ entry, diagnoses }: { entry: OccupationalHealthcareEntry, diagnoses: Diagnosis[]}) => {
  return (
    <Paper sx={{padding: "5px", borderRadius: "10px", borderColor: "black", margin: "5px" }} elevation={0} variant="outlined" >
      <span>{entry.date} <WorkIcon/> {entry.employerName} </span>
      <br/>
      <span style={{fontStyle: "italic"}}>{entry.description}</span>
      <ul>
        {entry.diagnosisCodes?.map(n => (
          <li key={n}> {n} {diagnoses.find(x => x.code === n)?.name} </li>
        ))}
      </ul>
      <span style={{ display: entry.sickLeave ? "block" : "none"}}>Sick Leave: {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate} </span>
      <span>Diagnose by {entry.specialist} </span>
    </Paper>
  );
};

export default OccupationalHealthcareInfo;