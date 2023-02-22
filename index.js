const { response, request } = require('express')
require('dotenv').config()
const Contact = require('./models/contact')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//let persons = []

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(persons => {
      response.json(persons)
    })   
})

app.get('/info', (request, response) => {  
  const date = new Date()
  Contact.find({}).then(persons => {
    const total = persons.length
    response.send(`<p>Phonebook has info for ${total} people</p>
                  <p>${date}</p>`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const person = persons.find(person => person.id === id)
  console.log(person)

  if(person){
    response.json(person)
  }
  else{
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const persons = persons.filter(person => person.id !== id)
  console.log('deleted')
  response.status(204).end()
})

function getRandomId(max) {
  return Math.floor(Math.random() * max);
}

app.post('/api/persons', (request, response) => {
  
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'info missing' 
    })
  }

  else if(persons.find(person => person.name === body.name)){
    return response.status(400).json({
      error : 'Name already exists'
    })
  }

  const person = {
    id : getRandomId(100),
    name : body.name,
    number : body.number
  }
  persons= persons.concat(person)
  response.json(person)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})