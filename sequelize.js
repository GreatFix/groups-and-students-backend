const Sequelize = require('sequelize')
const StudentModel = require("./models/student")
const GroupModel = require("./models/group")

const sequelize = new Sequelize('dbstudents', 'me', 'password', {
    host: 'localhost',
    dialect: 'postgres'
  })
  
const Student = StudentModel(sequelize, Sequelize)
const Group = GroupModel(sequelize, Sequelize)

Group.hasMany(Student, { onDelete: "cascade" })

sequelize.authenticate()
    .then(() => console.log('Successful connection.'))
    .catch(err => console.error('Connection error:', err)) 

sequelize.sync()
    .then(() => console.log("Synchronized") )
    .catch(err => console.error("Synchronization error:" + err))

module.exports = { Student, Group }