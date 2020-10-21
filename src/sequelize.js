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
    .then(() => console.log('Успешное соединение.'))
    .catch(err => console.error('Ошибка соединения:', err)) 

sequelize.sync()
    .then(() => console.log("Синхронизировано") )
    .catch(err => console.error("Ошибка синхронизации:" + err))

module.exports = { Student, Group }