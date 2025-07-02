require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const app = express()
const cors = require('cors')
const Person = require('./modules/person.js')

morgan.token('post-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
});

app.use(cors())

app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :post-data'
));

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => ({
      id: person._id,
      name: person.name,
      number: person.number
    })))
  }).catch(error => {
    console.error('Error fetching persons:', error)
    response.status(500).send({ error: 'Failed to fetch persons' })
  })
})

app.get('/info', (request, response) => { 
  Person.countDocuments({}).then(count => {
    const info = `<p>Phonebook has info for ${count} people</p>
                  <p>${new Date()}</p>`
    response.send(info)
  }).catch(error => {
    console.error('Error counting persons:', error)
    response.status(500).send({ error: 'Failed to count persons' })
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).send({ error: 'Person not found' })
    }
  }).catch(error => {
    console.error('Error fetching person:', error)
    response.status(500).send({ error: 'Failed to fetch person' })
  })
})

app.post('/api/persons', express.json(), (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.status(201).json({
      id: savedPerson._id,
      name: savedPerson.name,
      number: savedPerson.number
    })
  }).catch(error => {
    console.error('Error saving person:', error)
    response.status(500).send({ error: 'Failed to save person' })
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => {
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).send({ error: 'Person not found' })
    }
  }).catch(error => {
    console.error('Error deleting person:', error)
    response.status(500).send({ error: 'Failed to delete person' })
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})