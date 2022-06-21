const mongoose = require('mongoose')

const Schemma = mongoose.Schema

const component = new Schemma({
    codComponent: String,
    description: String,
    unit: String,
    store:[{
        storeCode: Number,
        storeBalance: Number
    }],

})

module.exports = mongoose.model('component', component)