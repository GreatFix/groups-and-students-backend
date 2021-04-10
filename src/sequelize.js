const Sequelize = require("sequelize");
const StudentModel = require("./models/student");
const GroupModel = require("./models/group");

const sequelize = new Sequelize(
  "d50et5f7tnlqrp",
  "fziktuhkujcpct",
  "a617f72aab6d0e9ae502c40196c46ca71368536090b1d32628744ee680277922",
  {
    host: "ec2-54-170-123-247.eu-west-1.compute.amazonaws.com",
    port: "5432",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }
);

const Student = StudentModel(sequelize, Sequelize);
const Group = GroupModel(sequelize, Sequelize);

Group.hasMany(Student, { onDelete: "cascade" });

sequelize
  .authenticate()
  .then(() => console.log("Successful connection."))
  .catch((err) => console.error("Connection error:", err));

sequelize
  .sync()
  .then(() => console.log("Synchronized"))
  .catch((err) => console.error("Synchronization error:" + err));

module.exports = { Student, Group };
