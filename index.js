require('./db/config')

const express = require('express')
const mongoose = require('mongoose')
const userModel = require('./db/User')
const productModel = require('./db/Product')
const cors = require('cors')
const JWT = require('jsonwebtoken')
const app = express()
const jwtKey = 'ecash'

app.use(express.json())
app.use(cors())

app.post('/register', async (req, res) => {
    let data = new userModel(req.body);
    let result = await data.save()
    let ores = result.toObject()
    delete ores.password
    if (ores) {
        JWT.sign({ data }, jwtKey, { expiresIn: '2h' }, (err, token) => {
            if (err) {
                res.send({ result: "Something went wrong" })
            } else {
                res.send({ data, auth: token })
            }
        })
    } else {
        res.send({ result: "Registration failed!" })
    }
})

app.post('/login', async (req, res) => {

    if (req.body.email && req.body.password) {
        let user = await userModel.findOne(req.body).select('-password')
        if (user) {
            JWT.sign({ user }, jwtKey, { expiresIn: '2h' }, (err, token) => {
                if (err) {
                    res.send({ result: "Something went wrong" })
                } else {
                    res.send({ user, auth: token })
                }
            })
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

app.post('/update-product/:id', async (req, res) => {
    let data = await productModel.updateOne({ _id: req.params.id }, { $set: req.body })
    res.send(data)
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

app.post('/search-id/:id', async (req, res) => {
    let data = await productModel.find({ _id: req.params.id })
    if (data.length > 0) {
        res.send(data)
    } else {
        res.send({ result: "No Product Found!" })
    }
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