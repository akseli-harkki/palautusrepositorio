interface TrainingStats {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

const parseExerciseArguments = (args: string[]) => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const argsAsNumbers = [];  

  for (let i = 2; i < args.length; i++) {
    if (!isNaN(Number(args[i]))) {      
      argsAsNumbers.push(Number(args[i]));
    } else {
      throw new Error('Provided values were not numbers!');
    }    
  }
  return argsAsNumbers;
};

export const calculateExercises = (target: number, dailyHours: number[]): TrainingStats => {
  const average = dailyHours.reduce((sum, x) => sum + x)/dailyHours.length;
  let rating = 0;
  let ratingDescription = '';
  if (average >= target) {
    rating = 3;
    ratingDescription = 'Great job, you met your target';
  } else if (average >= target/2) {
    rating = 2;
    ratingDescription = 'Good effort but you did not meet your target';
  } else {
    rating = 1;
    ratingDescription = 'You can do better';
  }
  return {
    periodLength: dailyHours.length,
    trainingDays: dailyHours.filter(n => n !== 0).length,
    success: rating > 2,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: average 
  };
};

try {
  const [target, ...dailyHours] = parseExerciseArguments(process.argv);
  console.log(calculateExercises( target, dailyHours));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}