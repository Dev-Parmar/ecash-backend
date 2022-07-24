require('./db/config')

const express = require('express')
const mongoose = require('mongoose')
const userModel = require('./db/User')
const productModel = require('./db/Product')
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

app.post('/add-product', async (req, res) => {
    let data = new productModel(req.body)
    let result = await data.save()
    res.send(result)
})

app.get('/products', async (req, res) => {
    let data = await productModel.find()
    if (data.length > 0) {
        res.send(data)
    } else {
        res.send({ result: "No Products Found!" })
    }
})

app.delete('/product/:id', async (req, res) => {
    let data = await productModel.deleteOne({ _id: req.params.id })
    res.send(data)
})

app.post('/search/:key', async (req, res) => {
    let data = await productModel.find({
        "$or": [
            { "name": { $regex: req.params.key } },
            { "price": { $regex: req.params.key } },
            { "company": { $regex: req.params.key } }
        ]
    })
    if (data.length > 0) {
        res.send(data)
    } else {
        res.send({ result: "No Product Found!" })
    }
})


app.listen(6969)