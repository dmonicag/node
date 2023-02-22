const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('please provide password as argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://mng22:${password}@cluster0.ihsr5po.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Contact = mongoose.model('Contact', contactSchema)

if(process.argv.length==5){
    const newName = process.argv[3]
    const newNumber = process.argv[4]

    const contact = new Contact({
        name: newName,
        number: newNumber,
    })

    contact.save().then(result => {
        console.log(`added ${newName} number ${newNumber} to phonebook`)
        mongoose.connection.close()
    })
}

else if(process.argv.length=3){
    Contact.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(contact => {
            console.log(contact.name + ' ' + contact.number)
        })
        mongoose.connection.close()
    })
}