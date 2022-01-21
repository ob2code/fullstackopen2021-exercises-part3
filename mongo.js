/*global process*/
/*eslint no-undef: "error"*/

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const mongoose = require('mongoose')

const password = process.argv[2]
const url =
    `mongodb+srv://fullstack:${password}@cluster0.tm3uh.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (process.argv.length == 3) {
    Phonebook.find({},).then(result => {
        result.forEach(phonebook => {
            console.log(phonebook.name, ' ', phonebook.number)
        })
        mongoose.connection.close()
    })

}

if (process.argv.length == 5) {
    const phonebook = new Phonebook({
        name: process.argv[3],
        number: process.argv[4],
    })

    phonebook.save().then(() => {
        console.log(`added ${phonebook.name} number ${phonebook.number} to phonebook`)
        mongoose.connection.close()
    })
}
