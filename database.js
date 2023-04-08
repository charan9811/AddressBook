const mongoose = require('mongoose');
require('dotenv').config()
var status = false



exports.connectDB = function(name){
    return mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.g81ghso.mongodb.net/${name}`)
}

const userSchema = new mongoose.Schema({
    'name': {type:String, required:true},
    'mobile': { type: String, unique: true, required:true }
})

const Contacts = mongoose.model('contact',userSchema)

exports.saveData = async function(name, number){
    const newEntry = new Contacts({
        'name':name,
        'mobile': number
    })

    try {
        await newEntry.save();
        status = true
      } catch (err) {
        status = err
      }

      return status
}

exports.getData = async function(){
    const contactList = await Contacts.find({})
    return contactList;
}

exports.findDataName = async function(searchedname){
    const foundList = await Contacts.find({name: { $regex:searchedname, $options: 'i'}}).sort({name:1});
    return foundList;
}

exports.findDataNumber = async function(editNumber){
    const foundContact = await Contacts.find({mobile:editNumber})
    return foundContact;
}


exports.deleteData = async function(number){
    const deleteReq = await Contacts.deleteOne({ mobile:number })
    return deleteReq
}

exports.updateNewData = async function(currentNumber, newName, newNumber){
    return await Contacts.updateOne({ mobile: currentNumber },{$set:{ name: newName, mobile: newNumber}});    
}