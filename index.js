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
    res.send(result)
})

app.listen(6969)