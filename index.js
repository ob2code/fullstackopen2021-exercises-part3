const express = require('express')
const cors = require('cors')
const app = express()



app.use(express.json())
app.use(express.static('build'))

// step 8 & 9: logging with morgan
const morgan = require('morgan')
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


app.use(cors())

let persons = [
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
        "number": "88-23-6423122"
    }
]

// default app
app.get('/', (request, response) => {
    response.send('<h1>Phonebook backend is running!</h1>')
})

// step 1: list all phonebook entries
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// step 2: display total of persons and request time
app.get('/info', (request, response) => {
    const reqTime = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${reqTime.toString()}</p>`)
})

// step 3: display the information for a single phonebook entry
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.statusMessage = "Current person does not exist!";
        response.status(404).end()
    }
})

// step 4: delele a single phonebook entry
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        persons = persons.filter(person => person.id !== id)
        response.statusMessage = `Person with id ${id} is deleted!`;
        response.status(204).end()
    } else {
        response.statusMessage = `This person does not exist!`;
        response.status(404).end()
    }
})

// step 5 & step 6: add new contact & error handling
const getRandomInt = () => Math.floor(Math.random() * 999999);

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }

    const found = persons.find(person => person.name === body.name)
    if (found) {
        return response.status(400).json({
            error: `The name ${body.name} already exists in the phonebook`
        })
    }

    const person = {
        id: getRandomInt(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

