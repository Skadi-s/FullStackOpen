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
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: function(v) {
                return /\d{2,3}-\d+/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    },
}, { collection: 'persons' })

const Person = mongoose.model('Person', personSchema)

module.exports = Person
