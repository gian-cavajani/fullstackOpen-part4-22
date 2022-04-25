const  mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    username:String,
    passwordHash: String,
    name: String
})

userSchema.set('toJSON',{
    transform: (doc,returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
        delete returnedObj.passwordHash
        
    }
})

module.exports = mongoose.model('user',userSchema)