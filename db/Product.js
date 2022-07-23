const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    company: String,
    userId: String
})

const productModel = mongoose.model('products', productSchema, 'products')

module.exports = productModel
