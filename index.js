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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
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

app.get('/api/persons/:id', (request, response, next) => {
    Contact.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      } else {
        response.status(404).end()
      }      
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
 Contact.findByIdAndRemove(request.params.id)
        .then(result => {
          response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {  
  const body = request.body
  const person = new Contact({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedContact => {
    response.json(savedContact)
  })  
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})