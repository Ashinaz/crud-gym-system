const express = require("express")
const mongoose = require("mongoose")

const app = express()

app.use(express.json())

app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/gym-system")
  .then(() => console.log("Now connected to MongoDB"))
  .catch((error) => console.log(`A connection error ${error} has occurred`))

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  membership: String,
  attendance: Number,
  active: Boolean,
  createdAt: { type: Date, default: Date.now },
  expireAt: Date
})

const membershipSchema = new mongoose.Schema({
  rate: Number,
  duration: Number,
})

const Member = mongoose.model("Member", memberSchema)

const Membership = mongoose.model("Member", membershipSchema)

app.get("/members", async (req, res) => {
  const members = await Member.find()
  res.json(members)
})

app.get("/memberships", async (req, res) => {
  const memberships = await Membership.find()
  res.json(memberships)
})

app.get("/member/:id", async (req, res) => {
  const member = await Member.findById(req.params.id)
  res.json(member)
})

app.get("/membership/:id", async (req, res) => {
  const membership = await Membership.findById(req.params.id)
  res.json(membership)
})

app.post("/members", async (req, res) => {
  try{
    const newMember = new Member({
      name: req.body.name,
      membership: req.body.membership,
      attendance: req.body.attendance,
      active: req.body.active,
      createdAt: req.body.createdAt,
      expireAt: req.body.expireAt,
    })
    const saved = await newMember.save()
    res.status(201).json(saved)
  }catch (err) {
    res.status(400).json({error: err.message})
  }
})

app.post("/memberships", async (req, res) => {
  try{
    const newMembership = new Membership({
      rate: req.body.rate,
      duration: req.body.duration,
    })
    const saved = await newMembership.save()
    res.status(201).json(saved)
  }catch (err) {
    res.status(400).json({error: err.message})
  }
})