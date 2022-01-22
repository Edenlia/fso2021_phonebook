const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
app.use(express.static('build'))
require('dotenv').config()

app.use(express.json())
// const logger = morgan('tiny')
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :data'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }
// app.use(requestLogger)


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/people', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/api/people/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  }).catch (error => next(error))
})

app.post('/api/people', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(result => {
    console.log('person saved!')
    response.json(person)
  }).catch (error => next(error))


})

app.put('/api/people/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/people/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then(people => {
    const num = people.length
    const ts = Date.now()

    let date_ob = new Date(ts)
    let date = date_ob.getDate()
    let month = date_ob.getMonth() + 1
    let year = date_ob.getFullYear()

    let now = year + '-' + month + '-' + date

    response.send(
      `<div><div>Phonebook has info for ${num} people</div><div>${now}</div></div>`
    )
  })
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    // console.log(error)
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

// 这是最后加载的中间件
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})