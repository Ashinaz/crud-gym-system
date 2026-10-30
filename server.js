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

const member = mongoose.model("Member", memberSchema)