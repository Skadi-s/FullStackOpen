import { useState } from 'react'
import { useEffect } from 'react'
import phoneService from './services/phones'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Number from './components/Number'
import Notification from './components/Notification'


const App = () => {
  // 将所有状态提升到 App 组件
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)  

  // 处理函数
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    // 检查是否已存在相同姓名
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        phoneService.update(
          persons.find(person => person.name === newName).id,
          { name: newName, number: newNumber }
        )
        .then(response => {
          setPersons(persons.map(person => 
            person.name === newName ? response.data : person
          ))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setMessage(`Error: ${error.response.data.error}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
      return
      }
    }

    const personObject = {
      name: newName,
      number: newNumber
    }
    phoneService
      .create(personObject)
      .then(response => {
        setMessage(`Added ${response.data.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setMessage(`Error: ${error.response.data.error}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id  === id)
    if (person && window.confirm(`delete ${person.name}?`)) {
      console.log(id)
      phoneService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(() => {
          alert(`${person.name} does not exist`)
        })
    }
  }

  useEffect(() => {
    phoneService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter 
        filter={filter} 
        handleFilterChange={handleFilterChange} 
      />
      <h2>Add a new</h2>
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Number 
        persons={persons}
        filter={filter}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App