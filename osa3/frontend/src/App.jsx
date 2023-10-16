import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons.jsx'

const Notification = ({message, setMessage}) => {
    if (message === null) {
        return
    }

    setTimeout(() => {
        setMessage(null)
    }, 5000)

    return (
        <div className="message">
            {message}
        </div>
    )
}
const Person = ({person, removePerson}) => {
    return (
        <p>
            {person.name} {person.number}
        <button onClick={removePerson}>delete</button>
        </p>
    )
}

const Filter = ({newFilter, handleFilterChange}) => {
    return (
        <form>
            filter shown with
            <input
                value={newFilter}
                onChange={handleFilterChange}
            />
        </form>
    )
}
const PersonForm = ({newName, newNumber, addName, handleNumberChange, handleNameChange}) => {

    return (
        <form onSubmit={addName}>
            <div>name:
                <input
                    value={newName}
                    onChange={handleNameChange}
                />
            </div>
            <div>number:
                <input
                    value={newNumber}
                    onChange={handleNumberChange}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}
const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const namesLowerCase = persons.map(person => person.name.toLowerCase())
    const personsFiltered = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
    const [message, setMessage] = useState(null)

    useEffect(() => {
        personsService
            .getData()
            .then(initialPersons => setPersons(initialPersons))
    }, [])

    const addName = (event) => {
        event.preventDefault()

        const personObject = {
            name: newName,
            number: newNumber
        }

        if(namesLowerCase.includes(newName.toLowerCase())) {
            if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                const toBeUpdated = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
                personsService
                    .update(toBeUpdated.id, personObject)
                    .then(response => {
                        setPersons(persons.map(person => person.id !== toBeUpdated.id ? person : response.data))
                        setMessage(`Updated ${newName}`)
                        setNewName('')
                        setNewNumber('')
                    })
                    .catch(error => {
                        setMessage(error.response.data.error)
                    })
            }
            return
        }

        personsService
            .create(personObject)
            .then(response => {
                setPersons(persons.concat(response.data))
                setMessage(`Added ${newName}`)
                setNewName('')
                setNewNumber('')
            })
            .catch(error => {
                setMessage(error.response.data.error)
            })
    }

    const removePerson = (person) => {
        if (confirm(`Delete ${person.name}`)) {
            setMessage(`Deleted ${person.name}`)
            personsService
                .remove(person.id)
                .then(response => setPersons(persons.filter(n => n.name!==person.name)))
        }
    }

    const handleFilterChange = (event) => {
        setNewFilter(event.target.value)
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message} setMessage={setMessage} />
            <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
            <h3>Add a new</h3>
            <PersonForm newName={newName} addName={addName} handleNumberChange={handleNumberChange} handleNameChange={handleNameChange} newNumber={newNumber}/>
            <h2>Numbers</h2>
            <div> {personsFiltered.map(person =>
                        <Person key={person.id}
                                person={person}
                                removePerson={() => removePerson(person)}/>
                )}
            </div>
        </div>
    )

}

export default App
