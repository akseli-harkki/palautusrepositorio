import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  if(isNaN(Number(weight)) || isNaN(Number(height))) {
    return res.status(400).json( {error: 'malformated parameters'});
  }
  const bmi = calculateBmi(Number(height), Number(weight));
  return res.status(200).json({ weight: weight, height: height, bmi: bmi });
});

app.post('/exercises', (req, res) => {
  const body = req.body;

  if(!body.daily_exercises || !body.target) {
    return res.status(400).json( {error: 'parameters missing'});
  }

  let target = undefined;

  if (isNaN(Number(body.target))) {
    return res.status(400).json( {error: 'malformated parameters'});
  } else {
    target = Number(body.target);
  }

  const daily_exercises = [];  

  for (const n in body.daily_exercises) {
    if (isNaN(Number(body.daily_exercises[n]))) {
      return res.status(400).json( {error: 'malformated parameters'});      
    } else {
      daily_exercises.push(Number(body.daily_exercises[n]));
    }
  }

  return res.status(200).json(calculateExercises(target, daily_exercises));    
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});