const mongoose = require('mongoose')

const Schemma = mongoose.Schema

const deliveryTime = new Schemma({
    codSupplier: Number,
    codComponent: String,
    deliveryTime: Number,
    price: Number,
    discount: Number,
    active: String
})

module.exports = mongoose.model('deliveryTime', deliveryTime)