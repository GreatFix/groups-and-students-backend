//created by Michigishev Umalat
const express = require("express")
const bodyParser = require("body-parser")
const { Student, Group } = require('./sequelize')
const exphbs = require('express-handlebars')
const path = require('path')

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));



app.get("/", (req, res) => {
    res.render('index')
})

app.get("/groups", async (req, res) => {
    try {
        const groups = await Group.findAll({ include: Student })
        res.render('groups',{
            title: 'Groups',
            groups: groups
        })
    } catch (err){
        res.status(400).send(err)
    }
})

app.get("/groups/:id", async (req, res) => {
    try {
        const {id} = req.params
        const group = await Group.findByPk(id,{ include: Student })
        group ? res.status(200).send.json(group):res.sendStatus(404)
    } catch (err){
        res.status(400).send(err)
    }
})

app.put("/groups/:id", async(req,res) =>{
    try {
        const {id} = req.params
        const {name} = req.body
            if(name){ 
                await Group.update(
                    { 
                    name: name
                    },  {
                        where: { id: id }
                        }
                )
                res.status(200).send("Updated!")
            }else {
                res.status(400).send("Invalid value")
            }
        } catch (err){
            res.status(400).send(err)
        }
})

app.post("/groups", async (req, res) => {
    try {
        const {name} = req.body
        const result = await Group.create({ name: name })
        res.status(200).send("Added!")
    } catch (err){
        res.status(400).send(err)
    }
})

app.delete("/groups/:id", async (req,res) => {
    try {
        const {id} = req.params
        const result = await Group.destroy({ where: { id: id }})
        result ? res.sendStatus(200):res.sendStatus(404)
    } catch (err){
        res.status(400).send(err)
    }
})

app.get("/students", async (req, res) => {
    try {
        const students = await Student.findAll()
        res.send(students)
    } catch (err){
        res.status(400).send(err)
    }
})

app.get("/students/:id", async (req, res) => {
    try {
        const {id} = req.params
        const student = await Student.findOne({where: { id: id}})
        student ? res.status(200).send(student):res.sendStatus(404)
    } catch (err){
        res.status(400).send(err)
    }
})

app.post("/students", async (req, res) => {
    try {
        const {firstName, lastName, groupId} = req.body
        const group = await Group.findByPk(groupId)
        if (group){
            await group.createStudent({firstName: firstName, lastName: lastName})
            res.sendStatus(201)
        }else
            res.sendStatus(404)
    } catch (err){
        res.status(400).send(err)
    }    
})

app.put("/students/:id", async(req,res) =>{
    try {
        const {id} = req.params
        const {firstName,lastName,groupId} = req.body
        if(await Student.findByPk(id)) {
            if(firstName && lastName && groupId){
                if(!await Group.findByPk(groupId)) res.status(404).send("Group not found") 
                await Student.update(
                    { 
                    firstName: firstName,
                    lastName: lastName,
                    groupId: groupId
                    },  {
                        where: { id: id }
                        }
                )
                res.status(200).send("Updated!")
            }
                else{
                    if(firstName){
                        await Student.update(
                            { 
                            firstName: firstName
                            },  {
                                where: { id: id }
                                }
                        )
                    }
                    if(lastName){
                        await Student.update(
                            { 
                            lastName: lastName
                            },  {
                                where: { id: id }
                                }
                        )
                    }
                    if(groupId){
                        if(!await Group.findByPk(groupId)) res.status(404).send("Group not found") 
                        await Student.update(
                            { 
                            groupId: groupId
                            },  {
                                where: { id: id }
                                }
                        )
                    }
                    res.status(200).send("Updated!")
                }
            } else {
                res.sendStatus(404)
            }
    } catch (err){
        res.status(400).send(err)
    }
})

app.delete("/students/:id", async (req,res) => {
    try {
        const {id} = req.params
        const result = await Student.destroy({ where: { id: id }})
        result ? res.sendStatus(200):res.sendStatus(404)
    } catch (err){
        res.status(400).send(err)
    }
})

app.listen(8080, () => console.log("Loading...interface"))
