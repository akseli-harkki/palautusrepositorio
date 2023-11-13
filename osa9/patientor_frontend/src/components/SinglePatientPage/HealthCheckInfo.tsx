import { Diagnosis, HealthCheckEntry } from "../../types";
import HealthRatingBar from "../HealthRatingBar";
import Paper from "@mui/material/Paper";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const HealthCheckInfo = ({ entry, diagnoses }: { entry: HealthCheckEntry, diagnoses: Diagnosis[]}) => {
  return (
    <Paper sx={{padding: "5px", borderRadius: "10px", borderColor: "black", margin: "5px" }} elevation={0} variant="outlined" >
      <span>{entry.date}  </span><CheckBoxIcon/>
      <br/>
      <span style={{fontStyle: "italic"}}>{entry.description}</span>
      <ul>
        {entry.diagnosisCodes?.map(n => (
          <li key={n}> {n} {diagnoses.find(x => x.code === n)?.name} </li>
        ))}
      </ul>
      <HealthRatingBar showText={false} rating={entry.healthCheckRating} />
      <span>Diagnose by {entry.specialist} </span>
    </Paper>
  );
};

export default HealthCheckInfo;