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
        minLength: 2},
    number: String,
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)