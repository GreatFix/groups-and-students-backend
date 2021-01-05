//created by Michigishev Umalat
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Student, Group } = require("./src/sequelize");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("Launched");
});

app.get("/groups", async (req, res) => {
  try {
    const groups = await Group.findAll({ include: Student });
    res.send(groups);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/groups/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id, { include: Student });
    group ? res.status(200).send(group) : res.sendStatus(404);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/groups", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await Group.create({ name: name });
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete("/groups/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Group.destroy({ where: { id: id } });
    result ? res.sendStatus(200) : res.sendStatus(404);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.findAll();
    res.send(students);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findOne({ where: { id: id } });
    student ? res.status(200).send(student) : res.sendStatus(404);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/students", async (req, res) => {
  try {
    const { name, groupName } = req.body;
    const group = await Group.findOne({ where: { groupName: groupName } });
    if (group) {
      await group.createStudent({ name: name });
      res.sendStatus(201);
    } else res.sendStatus(404);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, groupName } = req.body;
    if (await Student.findByPk(id)) {
      if (name && groupName) {
        if (!(await Group.findOne({ where: { groupName: groupName } })))
          res.status(404).send("Group not found");
        await Student.update(
          {
            name: name,
            groupName: groupName,
          },
          {
            where: { id: id },
          }
        );
        res.status(200).send("Updated!");
      } else {
        if (name) {
          await Student.update(
            {
              name: name,
            },
            {
              where: { id: id },
            }
          );
        }
        if (groupName) {
          if (!(await Group.findOne({ where: { groupName: groupName } })))
            res.status(404).send("Group not found");
          await Student.update(
            {
              groupName: groupName,
            },
            {
              where: { id: id },
            }
          );
        }
        res.status(200).send("Updated!");
      }
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Student.destroy({ where: { id: id } });
    result ? res.sendStatus(200) : res.sendStatus(404);
  } catch (err) {
    res.status(400).send(err);
  }
});

let port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("Listening on " + port);
});
