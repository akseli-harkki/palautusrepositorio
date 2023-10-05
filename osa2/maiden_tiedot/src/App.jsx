import { useState, useEffect } from 'react'
import axios from "axios";
import weatherApi from "./apis/weather.jsx";

const DisplayCountries = ({countries, setSearch, weatherLoading, weather}) => {
    if (countries.length > 10) {
        return <p>Too many matches, specify another filter</p>
    }

    if (countries.length ===1 && !weatherLoading) {
        return ShowCountry(countries[0], weather)
    }

    return (
        <div>
            {countries.map(country =>
                <Country key={country.name.common}
                         country={country}
                         setSearch={setSearch} />
            )}
        </div>
    )
}

function ShowCountry (country, weather){
    const languages = Object.values(country.languages)

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h3>languages:</h3>
            <ul>
                {languages.map(language =>
                    <li key={language}>
                        {language}</li>
                )}
            </ul>
            <img src={country.flags.png} alt='flag' />
            <h2>Weather in {country.capital}</h2>
            <p>temperature {weather.main.temp} °C</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt='weather icon' />
            <p>wind {weather.wind.speed} m/s</p>
        </div>
    )
}

const Country = ({country, setSearch}) => {
    return (
        <p>
            {country.name.common}
            <button onClick={() => setSearch(country.name.common)}>show</button>
        </p>
    )
}
function App() {
    const [search, setSearch] = useState("")
    const [weatherLoading, setWeatherLoading] = useState(true)
    const [countries, setCountries] = useState([])
    const [weather, setWeather] = useState([])
    const countriesFiltered = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

    useEffect(() => {
        axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(response => {
                setCountries(response.data)
            })
    }, [])

    useEffect(() => {
        if (countriesFiltered.length === 1) {
            weatherApi
                .getWeather(countriesFiltered[0].capital)
                .then(weather => {
                    setWeather(weather)
                    setWeatherLoading(false)
                })
        } else {
            setWeatherLoading(true)
        }
    }, [search]);


    const handleSearchChange = (event) => {
        setSearch(event.target.value)
    }

    return (
        <div>
            <form> find countries
                <input
                    value={search}
                    onChange={handleSearchChange}/>
            </form>
            <DisplayCountries countries={countriesFiltered}
                              setSearch={setSearch}
                              weather={weather}
                              weatherLoading={weatherLoading}/>
        </div>
    )
}

export default App
