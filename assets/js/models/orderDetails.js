const mongoose = require('mongoose')

const Schemma = mongoose.Schema

const orderDetails = new Schemma({
    detailCod: Number,
    orderNumber: Number,
    storeCode: Number,
    componentCode: String,
    amount: Number,
    price: Number,
    unit: String,
    discountPercentage: Number,
    total: Number
})

module.exports = mongoose.model('orderDetails', orderDetails)