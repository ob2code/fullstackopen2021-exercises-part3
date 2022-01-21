const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const phonebookSchema = new mongoose.Schema({
    name: { type: String, index: true, required: true, unique: true, minLength: [3, 'Must be at least 3 characters.'] },
    number: {
        type: String, validate: {
            validator: function (v) {
                return /\d{3}-\d{5}/.test(v);
            },
            message: props => `${props.value} is not valid, the phone number format must have at least 8 digits!`
        }
    }
})


phonebookSchema.plugin(uniqueValidator);


phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)
