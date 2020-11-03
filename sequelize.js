const Sequelize = require('sequelize')
const StudentModel = require("./models/student")
const GroupModel = require("./models/group")

// const sequelize = new Sequelize('dc6ktj1usj244s', 'qbdzvigiaicjpc', '98edc681c173576a8c40f5b0c508e3298a3f441f7ebcf9b9b4e749f9bd390305', {
//     host: 'ec2-54-75-199-252.eu-west-1.compute.amazonaws.com',
//     port: '5432',
//     dialect: 'postgres'
//   })
  
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