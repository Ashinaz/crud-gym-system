const dotenv = require('dotenv');
dotenv.config()
const express = require("express")
const mongoose = require("mongoose")

const app = express()

app.use(express.json())

app.use(express.static("public"))

const DB_URL = process.env.MONGODB_URI

mongoose.connect(DB_URL)
  .then(() => console.log("Now connected to MongoDB"))
  .catch((error) => console.log(`A connection error ${error} has occurred`))

const memberSchema = new mongoose.Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  membership: String,
  attendance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

const membershipSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  rate: { type: Number, required: true },
  duration: { type: Number, required: true },
})

const Member = mongoose.model("Member", memberSchema)

const Membership = mongoose.model("Membership", membershipSchema)

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
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      membership: req.body.membership,
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
      planName: req.body.planName,
      rate: req.body.rate,
      duration: req.body.duration,
    })
    const saved = await newMembership.save()
    res.status(201).json(saved)
  }catch (err) {
    res.status(400).json({error: err.message})
  }
})

app.put("/members/:id", async (req, res) => {
  const updated = await Member.findByIdAndUpdate(
    req.params.id, 
    {
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      membership: req.body.membership,
    },
    { new: true, runValidators: true }
  )
  res.json(updated)
})

app.put("/memberships/:id", async (req, res) => {
  const updated = await Membership.findByIdAndUpdate(
    req.params.id, 
    {
      planName: req.body.planName,
      rate: req.body.rate,
      duration: req.body.duration,
    },
    { new: true, runValidators: true }
  )
  res.json(updated)
})

app.delete("/members/:id", async (req, res) => {
  const deleted = await Member.findByIdAndDelete(req.params.id)
  res.json(deleted)
})

app.delete("/memberships/:id", async (req, res) => {
  const deleted = await Membership.findByIdAndDelete(req.params.id)
  res.json(deleted)
})

app.listen(3000, () => {
  console.log("Running on port 3000...")
})