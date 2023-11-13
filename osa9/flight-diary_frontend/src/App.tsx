import { useEffect, useState } from 'react';
import { NonSensitiveDiaryEntry } from './types';
import { getAllDiaryEntries } from './services/diaries';
import DiaryEntry from './components/DiaryEntry';
import DiaryForm from './components/DiaryForm';


function App() {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaryEntries().then(data => setDiaries(data));
  }, []);

  return (
    <div className='container'>
      <DiaryForm diaries={diaries} setDiaries={setDiaries} />
      <h2>Diary entries</h2>
      {diaries.map(n => (
        <div key={n.id}>
          <DiaryEntry entry={n} />
        </div>
      ))}
    </div>
  );
}

export default App;
