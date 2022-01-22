import React, {useEffect, useState} from 'react'
import peopleService from "./services/people"
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

const People = (props) => {
  return (
    <div>
      {props.peoplehow.map(person => <div key={person.id}>{person.name} {person.number}
        <button onClick={() => props.deletePerson(person)}>delete</button>
      </div>)}
    </div>
  )
}

const App = () => {
  const [people, setpeople] = useState([])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState(null)
  const [type, setType] = useState(1)


  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}`)) {
      peopleService.deletePerson(person.id)
        .then(response => {
          console.log(response)
          Notify(`Deleted`, 1)
          getAll()
        }).catch(error => Notify(`${error.response.data.error}`, 2))
    }
  }

  const getAll = () => {
    peopleService.getAll()
      .then(response => {
        setpeople(response.data)
      }).catch(error => {
      Notify(`${error.response.data.error}`, 2)
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
    peopleService.create(person)
      .then(response => {
        console.log(response.data)
        setpeople(people.concat(response.data))
        Notify(`Added '${person.name}`, 1)
      }).catch(error => {
        console.log(error.response.data.error)
      Notify(`${error.response.data.error}`, 2)
    })
  }

  const updatePerson = (person) => {
    peopleService.update(person.id, person)
      .then(response => {
        console.log(response)
        const index = response.data
        const copy = people.map(p => p.id === person.id ? index : p)
        setpeople(copy)
        Notify(`Updated ${person.name}`, 1)
      }).catch(error => {
      Notify(`${error.response.data.error}`, 2)
    })
  }

  useEffect(getAll, [])

  // const peoplehow = people.filter(person => person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
  // const peoplehow = people

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
    if (people.find(item => item.name === person.name)) {
      const previous = people.find(item => item.name === person.name)
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
      {/*{peoplehow.map(person => <div key={person.name}>{person.name} {person.number}</div>)}*/}
      <People
        peoplehow={people.filter(person => person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))}
        deletePerson={deletePerson}/>
    </div>
  )
}

export default App