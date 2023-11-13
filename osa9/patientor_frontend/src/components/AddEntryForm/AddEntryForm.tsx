import { SyntheticEvent, useState } from "react";
import { Theme, useTheme, FormLabel, TextField, Grid, Button, Alert, InputLabel, MenuItem, Select, SelectChangeEvent, Input } from "@mui/material";
import { BaseEntryWithoutId, Diagnosis, EntryFormValues } from "../../types";
import { CheckBox, Work, LocalHospital } from "@mui/icons-material";


interface Props {
  onSubmit: (values: EntryFormValues) => Promise<string | undefined>;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
  error: string | undefined;
  diagnoses: Diagnosis[];
}

enum Type {
  Hide = "hide",
  Check = "HealthCheck",
  Hospital = "Hospital",
  Occupational = "OccupationalHealthcare"
}

const ITEM_HEIGHT = 65;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const HEALTHRATING_TEXTS = [
  "The patient is in great shape",
  "The patient has a low risk of getting sick",
  "The patient has a high risk of getting sick",
  "The patient has a diagnosed condition",
];

const getStyles = (name: string, diagnosisCodes: string[], theme: Theme) => {
  return {
    fontWeight:
      diagnosisCodes.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightBold,
  };
};

const separateByCapitalLetters = (text: string): string | null => {
  const separated = text.match(/[A-Z][a-z]+|[0-9]+/g);
  if (!separated) return null;
  return separated.join(" ");
};

const AddEntryForm = ({ onSubmit, setError, error, diagnoses }: Props) => {
  const theme = useTheme();
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [specialist, setSpecialist] = useState<string>("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);
  const [dischargeDate, setDischargeDate] = useState<string>("");
  const [dischargeCriteria, setDischargeCriteria] = useState<string>("");
  const [employerName, setEmployerName] = useState<string>("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState<string>("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState<string>("");
  const [type, setType] = useState<Type>(Type.Hide);

  const clearFields = (): void => {
    setType(Type.Hide);
    setDescription("");
    setDate("");
    setSpecialist("");
    setDiagnosisCodes([]);
    setHealthCheckRating(0);
    setDischargeDate("");
    setDischargeCriteria("");
    setEmployerName("");
    setSickLeaveStartDate("");
    setSickLeaveEndDate("");
    setError(undefined);
  };

  const handleHealthRating = (event: SelectChangeEvent<number>) => {
    event.preventDefault();
    if (typeof event.target.value === "number") {
      setHealthCheckRating(event.target.value);
    }
  };

  const handleDiagnosisCodes = (event: SelectChangeEvent<string[]>) => {
    event.preventDefault();
    const value = event.target.value;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const addEntry = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (type === "hide") {
      return;
    }

    const baseEntry: BaseEntryWithoutId = {
      description: description,
      date: date,
      specialist
    };
    if (diagnosisCodes) {
      baseEntry.diagnosisCodes = diagnosisCodes;
    }
    switch(type) {
    case "HealthCheck":
      const response1 = await onSubmit({
        ...baseEntry,
        healthCheckRating,
        type: type
      });
      if (response1) {
        clearFields();
      }
      break;
    case "Hospital":        
      const response2 = await onSubmit({
        type: type,
        ...baseEntry,
        discharge: {
          date: dischargeDate,
          criteria: dischargeCriteria,
        },
      });
          
      if (response2) {
        clearFields();
      }       
      break;
    case "OccupationalHealthcare":
      const occupationalEntry: EntryFormValues = {
        type: type,
        ...baseEntry,
        employerName,
      };
      if(sickLeaveStartDate !=="" || sickLeaveEndDate !=="") {
        occupationalEntry.sickLeave = {
          startDate: sickLeaveStartDate,
          endDate: sickLeaveEndDate
        };
      }
      const response3 = await onSubmit(occupationalEntry);
      if (response3) {
        clearFields();
      }
      break;
    }  
  };

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    clearFields();
  };  
  
  return (    
    <div>
      <h2>Add Entry</h2>
      <Grid container spacing={2}>
        <Grid item>
          <Button 
            onClick={() => setType(Type.Check)}
            variant="contained"
            endIcon={<CheckBox />}
          >
          Health Check
          </Button>
        </Grid>
        <Grid item>
          <Button 
            onClick={() => setType(Type.Hospital)}
            variant="contained"
            endIcon={<LocalHospital />}
          >
          Hospital
          </Button>
        </Grid>
        <Grid item>
          <Button 
            onClick={() => setType(Type.Occupational)}
            variant="contained"
            endIcon={<Work />}
          >
          Occupational
          </Button>
        </Grid>
      </Grid>

      <Grid onSubmit={addEntry} 
        component="form" 
        sx={{ margin: 2,
          border:1,
          padding: 2,
          display: type !== Type.Hide ? "block" : "none" }} >
        {error && <Alert severity="error">{error}</Alert>}
        <h2>{separateByCapitalLetters(type)} Entry</h2>
        <Grid item p={1}>
          <TextField
            label="Description"
            fullWidth
            variant="standard"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
        </Grid>        
        <Grid item p={1}>
          <FormLabel>Date</FormLabel>
          <br/>
          <Input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </Grid>        
        <Grid item p={1}>
          <TextField
            label="Specialist"
            fullWidth
            variant="standard"
            value={specialist}
            onChange={({ target }) => setSpecialist(target.value)}
          />
        </Grid>        
        <Grid item p={1}>
          <InputLabel>Diagnoses codes</InputLabel>
          <Select
            label="Health rating"
            fullWidth
            displayEmpty
            multiple
            value={diagnosisCodes}
            onChange={handleDiagnosisCodes}
            MenuProps={MenuProps}
          >
            {diagnoses.map(n => (
              <MenuItem
                key={n.code}
                value={n.code}
                style={getStyles(n.code, diagnosisCodes, theme)}
              >
                {n.code}
              </MenuItem>
            ))}
          </Select>
        </Grid>        
        <Grid p={1} style={{ display: type === Type.Check ? "block" : "none"}}>
          <InputLabel>Health rating</InputLabel>
          <Select
            label="Health rating"
            fullWidth
            displayEmpty
            value={healthCheckRating}
            onChange={handleHealthRating}
          >
            {HEALTHRATING_TEXTS.map((text, index) => (
              <MenuItem
                key={text}
                value={index}
              >
                {text}
              </MenuItem>
            ))}
          </Select> 
        </Grid>        
        <Grid item p={1} style={{ display: type === Type.Hospital ? "block" : "none"}}>
          <FormLabel>Discharge date</FormLabel>
          <br/>
          <Input
            type="date"
            value={dischargeDate}
            onChange={({ target }) => setDischargeDate(target.value)}
          />
        </Grid>
        <Grid item p={1} style={{ display: type === Type.Hospital ? "block" : "none"}}>
          <TextField
            label="Discharge criteria"
            fullWidth
            variant="standard"
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
          />
        </Grid>
        <Grid item p={1} style={{ display: type === Type.Occupational ? "block" : "none"}}>
          <TextField
            label="Employer name"
            fullWidth
            variant="standard"
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
          />  
        </Grid>        
        <Grid item p={1} style={{ display: type === Type.Occupational ? "block" : "none"}}>
          <FormLabel>Sick leave start date</FormLabel>
          <br/>
          <Input
            type="date"
            value={sickLeaveStartDate}
            onChange={({ target }) => setSickLeaveStartDate(target.value)}
          />
        </Grid>        
        <Grid item p={1} style={{ display: type === Type.Occupational ? "block" : "none"}}>
          <FormLabel>Sick leave end date</FormLabel>
          <br/>
          <Input
            type="date"
            value={sickLeaveEndDate}
            onChange={({ target }) => setSickLeaveEndDate(target.value)}
          />
        </Grid>
        <Grid sx={{paddingBottom: 5}}>
          <Grid item>
            <Button
              style={{
                float: "left",                
              }}
              color="error"
              variant="contained"              
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Grid>     
    </div>
  );
};

export default AddEntryForm;