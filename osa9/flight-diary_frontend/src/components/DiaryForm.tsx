import { useState } from 'react';
import { createDiaryEntry } from '../services/diaries';
import { NewDiaryEntry, NonSensitiveDiaryEntry, Visibility, Weather } from '../types';

const DiaryForm = ({ diaries, setDiaries }: {diaries: NonSensitiveDiaryEntry[], setDiaries: React.Dispatch<React.SetStateAction<NonSensitiveDiaryEntry[]>> }) => {
  const [style, setStyle] = useState('none');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState('');

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newDiaryEntry: NewDiaryEntry = {
      date,
      visibility,
      weather,
      comment
    };
    createDiaryEntry(newDiaryEntry)
      .catch((error) => {
        setMessage(error.response.data);
        setStyle('alert');
        setTimeout(()=> setStyle('none'), 5000);
      })
      .then((response) => {
        if (response) {
          setDiaries(diaries.concat(response));
          setMessage('New diary added');
          setStyle('success');
          setTimeout(()=> setStyle('none'), 5000);
          setComment('');
        }        
      });    
  };

  return (
    <fieldset className="add-entry">
      <legend>Add new entry</legend>
      <div className={style}>
        {message}
      </div>
      <form onSubmit={diaryCreation}>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div className="form-group">
          <legend>Visibility</legend>
          {Object.values(Visibility).map(n => (
            <span className='radio-buttons' key={n}>
              <label>{n}</label>
              <input
                type="radio"
                name="visibility"
                value={n}
                checked={visibility===n}
                onChange={({ target }) => setVisibility(target.value as Visibility)}              
              />
            </span>
          ))}          
        </div>
       
        <div className="form-group">
          <legend>Weather</legend>
          {Object.values(Weather).map(n => (
            <span className='radio-buttons' key={n}>
              <label>{n}</label>
              <input
                type="radio"
                name="weather"
                value={n}
                checked={weather===n}
                onChange={({ target }) => setWeather(target.value as Weather)}              
              />
            </span>
          ))}   
        </div>
        <div className="form-group">
          <label>Comment</label>
          <input
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button>submit</button>
      </form>
    </fieldset>
      
  );
};

export default DiaryForm;