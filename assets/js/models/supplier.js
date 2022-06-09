const mongoose = require('mongoose')

const Schemma = mongoose.Schema

const supplier = new Schemma({
    codSupplier: Number,
    name: String,
    rnc: String,
    city: String,
    address: String
})

module.exports = mongoose.model('supplier', supplier)