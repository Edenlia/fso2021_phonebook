import React, {useEffect, useState} from 'react'
import personService from "./services/persons"
import './index.css'

const Filter = (props) => {
  return (
    <div>
      <div>filter shown with</div>
      <input value={props.filter} onChange={props.handler}/>
    </div>
  )
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  if (type === 1) {
    return (
      <div className='notify'>
        {message}
      </div>
    )
  } else {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }

}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.submitHandler}>
      <div>
        name: <input value={props.newName} onChange={props.nameHandler}/>
      </div>
      <div>number: <input value={props.newNumber} onChange={props.numberHandler}/></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = (props) => {
  return (
    <div>
      {props.personShow.map(person => <div key={person.id}>{person.name} {person.number}
        <button onClick={() => props.deletePerson(person)}>delete</button>
      </div>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState(null)
  const [type, setType] = useState(1)


  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}`)) {
      personService.deletePerson(person.id)
        .then(response => {
          console.log(response)
          getAll()
        }).catch(error => Notify(`Information of ${person.name} has already been removed from server`, 2))
    }
  }

  const getAll = () => {
    personService.getAll()
      .then(response => {
        setPersons(response.data)
      }).catch(error => {
      alert("error")
    })
  }

  const Notify = (mess, ty) => {
    setMessage(mess)
    setType(ty)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addPerson = (person) => {
    // console.log(person)
    personService.create(person)
      .then(response => {
        console.log(response.data)
        setPersons(persons.concat(response.data))
        Notify(`Added '${person.name}`, 1)
      }).catch(error => {
      Notify(`Information of ${person.name} has already been removed from server`, 2)
    })
  }

  const updatePerson = (person) => {
    personService.update(person.id, person)
      .then(response => {
        console.log(response)
        const index = response.data
        const copy = persons.map(p => p.id === person.id ? index : p)
        setPersons(copy)
        Notify(`Updated ${person.name}`, 1)
      }).catch(error => {
      Notify(`Information of ${person.name} has already been removed from server`, 2)
    })
  }

  useEffect(getAll, [])

  // const personShow = persons.filter(person => person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
  // const personShow = persons

  const handleChangeNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleChangeNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleChangeFilter = (event) => {
    setFilter(event.target.value)
  }

  const submitForm = (event) => {
    event.preventDefault()
    const person = {name: newName, number: newNumber}
    // console.log(person)
    if (persons.find(item => item.name === person.name)) {
      const previous = persons.find(item => item.name === person.name)
      person.id = previous.id
      console.log(person)
      if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
        updatePerson(person)
      }
    }
    else {
      addPerson(person)
    }


    setNewName("")
    setNewNumber("")
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={type}/>
      <Filter filter={filter} handler={handleChangeFilter}/>
      <h3>add a new</h3>
      <PersonForm submitHandler={submitForm} newName={newName} newNumber={newNumber}
                  nameHandler={handleChangeNewName} numberHandler={handleChangeNewNumber}/>
      <h3>Numbers</h3>
      {/*{personShow.map(person => <div key={person.name}>{person.name} {person.number}</div>)}*/}
      <Persons
        personShow={persons.filter(person => person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))}
        deletePerson={deletePerson}/>
    </div>
  )
}

export default App