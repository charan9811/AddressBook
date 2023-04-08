const express = require('express');
const db = require('./database');
const bodyParser = require('body-parser')

db.connectDB('userDB')
const app = express();
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))


app.route("/")
.get(async(req,res)=>{


    let contacts = await db.getData()
    res.render('index', {contactList:contacts})

})
.post(async(req,res)=>{

    const name = req.body.name;
    const number = req.body.number;
    const status = await db.saveData(name, number)
    
    if (status){
        res.redirect("/")
    }else{
        console.log(status)
    }
})

app.route("/search")
.post(async(req,res)=>{
    searchedName = req.body.searchedName;

    const foundList = await db.findDataName(searchedName)
    console.log(foundList)

    res.render("search", {searchedList:foundList})
})

app.post("/delete", async (req,res)=>{
    const deleteRequest = await db.deleteData(req.body.delbutton)
    if(deleteRequest.deletedCount === 1){
        res.redirect("/")
    }else{
        console.log("Error")
    }

})


app.get("/edit/",async(req,res)=>{
    const newName = req.query.newName
    const newNumber = req.query.newNumber
    const currentNumber = req.query.updatebutton

    const foundContact = await db.findDataNumber(currentNumber);
    foundContact.map(async (contact) => {
        if (contact.name != newName || contact.mobile != newNumber) {
          await db.updateNewData(currentNumber, newName, newNumber);
          res.redirect("/");
        }
      });

})
    
app.post("/edit/:mNumber", async (req, res) => {

    const currentNumber = req.params.mNumber;
    const foundContact = await db.findDataNumber(currentNumber);
    res.render("edit", { fillData: foundContact });

  })

app.listen(3000, ()=>{
    console.log("started")
})