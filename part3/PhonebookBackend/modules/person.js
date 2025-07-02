const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = `mongodb+srv://jiangbl:${process.env.MONGODB_PASSWORD}@cluster0.aud6j.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

console.log('connecting to', url)

mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.error('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: String,
}, { collection: 'persons' })

const Person = mongoose.model('Person', personSchema)

module.exports = Person
