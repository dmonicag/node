const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to database...')

mongoose.connect(url)
  .then(result => {
    console.log('Database connected')
  })
  .catch((error) => {
    console.log('error connecting to database:', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2 },
  number: {
    type: String,
    minLength: 9,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d{5,10}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'Phone number required']
  }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)