const mongoose = require('mongoose')

const Schemma = mongoose.Schema

const inventoryMovement = new Schemma({
    movementCode: Number,
    movementDate: Date,
    storeCode: Number,
    movementType: String,
    details: [{
        componentCode: String,
        movementCode: Number,
        unit: String
    }]
})

module.exports = mongoose.model('inventoryMovement', inventoryMovement)