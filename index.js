/*global process*/
/*eslint no-undef: "error"*/

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

const Phonebook = require('./models/phonebook')

app.use(express.json())
app.use(express.static('build'))


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

// step 8 & 9: logging with morgan
const morgan = require('morgan')
morgan.token('data', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.use(cors())

// default app
app.get('/', (request, response) => {
    response.send('<h1>Phonebook backend is running!</h1>')
})

// step 1: list all phonebook entries
// step 3.13
app.get('/api/persons', (request, response) => {
    Phonebook.find({},).then(persons => {
        response.json(persons)
    })
})

// step 2: display total of persons and request time
app.get('/info', (request, response) => {
    const reqTime = new Date()
    Phonebook.countDocuments({}, (err, count) => {
        response.send(`<p>Phonebook has info for ${count} people</p><p>${reqTime.toString()}</p>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Phonebook.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})



// step 4: delele a single phonebook entry
// step 3.15
app.delete('/api/persons/:id', (request, response, next) => {
    Phonebook.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})
// step 3.5 & step 3.6: add new contact & error handling
// step 3.14 & 3.19
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }

    const phonebook = new Phonebook({
        name: body.name,
        number: body.number
    })

    phonebook.save()
        .then(person => {
            console.log(`added ${phonebook.name} number ${phonebook.number} to phonebook`)
            response.json(person)
        })
        .catch(error => next(error))


})


app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Phonebook.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
// Step 3.16
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

