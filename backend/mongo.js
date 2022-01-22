const mongoose = require('mongoose')
require('dotenv').config()

if ( process.argv.length<4 ) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const username = process.env.MONGO_USERNAME
const password = process.env.MONGO_PASSWORD
const app_name = process.env.APP_NAME

const person_name = process.argv[2]
const person_number = process.argv[3]

const url =
  `mongodb+srv://${username}:${password}@cluster0.duf5r.mongodb.net/${app_name}?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: person_name,
  number: person_number
})


// person.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

Person.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})