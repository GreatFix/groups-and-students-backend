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

app.get("/groups/students", async (req, res) => {
  try {
    const groups = await Group.findAll({ include: Student });
    res.send(groups);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/groups", async (req, res) => {
  try {
    const groups = await Group.findAll();
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
    if (name) {
      const result = await Group.create({ name: name });
      res.status(200).send(result);
    } else {
      res.status(400).send("Empty value");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put("/groups/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (await Group.findByPk(id)) {
      if (name) {
        let result = await Group.update(
          {
            name,
          },
          {
            where: { id: id },
          }
        );
        res.status(200).send(result);
      } else {
        res.status(400).send("Empty value");
      }
    } else {
      res.status(404).send("Group not found");
    }
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
    if (name && groupName) {
      const group = await Group.findOne({ where: { name: groupName } });
      if (group) {
        const result = await group.createStudent({
          name: name,
          groupName: groupName,
        });
        res.status(200).send(result);
      } else res.sendStatus(404);
    } else {
      res.status(400).send("Empty value");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, groupName } = req.body;
    let result;
    if (await Student.findByPk(id)) {
      if (name && groupName) {
        if (!(await Group.findOne({ where: { name: groupName } })))
          res.status(404).send("Group not found");
        else {
          result = await Student.update(
            {
              name: name,
              groupName: groupName,
            },
            {
              where: { id: id },
            }
          );
          res.status(200).send(result);
        }
      } else {
        if (name) {
          result = await Student.update(
            {
              name: name,
            },
            {
              where: { id: id },
            }
          );
        } else if (groupName) {
          if (!(await Group.findOne({ where: { name: groupName } })))
            res.status(404).send("Group not found");
          else {
            result = await Student.update(
              {
                groupName: groupName,
              },
              {
                where: { id: id },
              }
            );
          }
          res.status(200).send(result);
        }
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
