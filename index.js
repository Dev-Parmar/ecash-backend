require('./db/config')

const express = require('express')
const mongoose = require('mongoose')
const userModel = require('./db/User')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

app.post('/register', async (req, res) => {
    let data = new userModel(req.body);
    let result = await data.save()
    let ores = result.toObject()
    delete ores.password
    res.send(ores)
})

app.post('/login', async (req, res) => {

    if (req.body.email && req.body.password) {
        let data = await userModel.findOne(req.body).select('-password')
        if (data) {
            res.send(data)
        } else {
            res.send({ result: "No user found" })
        }
    } else {
        res.send({ result: "Input fields empty" })
    }
})


app.listen(6969)