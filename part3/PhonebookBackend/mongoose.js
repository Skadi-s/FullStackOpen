const mongoose = require('mongoose')

if (process.argv.length < 5) {
  console.log('Please provide the password, name, and number as arguments: node mongoose.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://jiangbl:${password}@cluster0.aud6j.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
}, {collection: 'persons'})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

person.save().then(result => {
  console.log('person saved!')
  // mongoose.connection.close()
})

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person.name, person.number)
  })
  mongoose.connection.close()
})