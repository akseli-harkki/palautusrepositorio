import { Diagnosis, HospitalEntry } from "../../types";
import Paper from "@mui/material/Paper";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const HospitalInfo = ({ entry, diagnoses }: { entry: HospitalEntry, diagnoses: Diagnosis[]}) => {
  return (
    <Paper sx={{padding: "5px", borderRadius: "10px", borderColor: "black", margin: "5px" }} elevation={0} variant="outlined" >
      <span>{entry.date}  </span><LocalHospitalIcon/>
      <br/>
      <span style={{fontStyle: "italic"}}>{entry.description}</span>
      <ul>
        {entry.diagnosisCodes?.map(n => (
          <li key={n}> {n} {diagnoses.find(x => x.code === n)?.name} </li>
        ))}
      </ul>
      <span>Discharge date: {entry.discharge.date} </span>
      <br/>
      <span>Discharge criteria: {entry.discharge.criteria} </span>
      <br/>
      <span>Diagnose by {entry.specialist} </span>
    </Paper>
  );
};

export default HospitalInfo;