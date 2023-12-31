const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}



const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://akseliharkki:${password}@puhelinluettelo.7fpvvhk.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

if (process.argv.length < 5) {
  console.log('Phonebook');
  Person
    .find({})
    .then(result => {
      result.forEach(n => {
        console.log(n.name + ' ' + n.number)
      })
      mongoose.connection.close()
      process.exit(1)
    })
  
}

if (process.argv.length == 5) {
	person.save().then(result => {
	console.log(`Added ${name} number ${number} to phonebook`)
	mongoose.connection.close()
	
	})
}	

