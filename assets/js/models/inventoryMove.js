const mongoose = require('mongoose')

const Schemma = mongoose.Schema

const order = new Schemma({
    orderNumber : Number,
    codSupplier : String,
    citySuplier : String,
    orderDate : Date,
    total : Number
})

module.exports = mongoose.model('order', order)