const express = require('express')
const morgan = require('morgan');
const app = express()
const cors = require('cors')

let phonebook = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

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
  response.json(phonebook)
})

app.get('/info', (request, response) => { 
  const date = new Date()
  const count = phonebook.length
  response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = phonebook.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).send({ error: 'Person not found' })
  }
})

app.post('/api/persons', express.json(), (request, response) => {
  const newPerson = request.body
  if (!newPerson.name || !newPerson.number) {
    return response.status(400).json({ error: 'Name or number is missing' })
  }
  
  const existingPerson = phonebook.find(p => p.name === newPerson.name)
  if (existingPerson) {
    return response.status(400).json({ error: 'Name must be unique' })
  }

  const id = Math.max(...phonebook.map(p => p.id)) + 1
  const personToAdd = { ...newPerson, id }
  phonebook.push(personToAdd)
  response.status(201).json(personToAdd)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})