import { NonSensitiveDiaryEntry } from '../types';

const DiaryEntry = ({ entry }: { entry: NonSensitiveDiaryEntry }) => {
  return (
    <div>
      <h3> {entry.date} </h3>
      <span>visibility: {entry.visibility} </span>
      <br/>
      <span>weather: {entry.weather} </span>
    </div>
  );
};

export default DiaryEntry;