//Librerias necesarias
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const url = require('url')

//Schemas
const Component = require('./models/component')
const DeliveryTime = require('./models/deliveryTime')
const InventoryMove = require('./models/inventoryMove')
const Order = require('./models/order')
const OrderDetails = require('./models/orderDetails')
const Supplier = require('./models/supplier')

router.get('/components/list', async(req,res)=>{
    const components = await Component.find()
    res.send(components)
})

router.get('/components/:id', async(req,res)=>{
    const {id} = req.params
    const aggregate = [
        {$match: {
            codComponent: id
        }},
        {$lookup:{
            from: "DeliveryTime",
            localField: "codComponent",
            foreignField:"codComponent",
            as: "deliveryDetails"
        }}
    ]
    const component = await Component.aggregate(aggregate) 
    res.send(component)
})

router.put('/components/:id', async(req,res)=>{
    const {id} = req.params
    await Component.update({codComponent:id},req.body)
    res.send(component)
})

router.post('/components', async(req,res)=>{
    const {codComponent} = req.body
    var exists = await Component.exists({codComponent:codComponent})
    if(!exists){
        const component = new Component(req.body)
        await component.save()
        res.send(component)
    }
    res.send('Error! Producto ya existe')
})

router.post('/suppliers', async(req,res)=>{
    const supplier = new Supplier(req.body)
    await supplier.save()
    res.send(component)
})

router.get('/suppliers/list', async(req,res)=>{
    const suppliers = await Supplier().find()
    res.send(suppliers)
})

router.get('/suppliers/:id', async(req,res)=>{
    const {id} = req.params
    const aggregate = [
        {$match: {
            codSupplier: id
        }},
        {$lookup:{
            from: "DeliveryTime",
            localField: "codSupplier",
            foreignField:"codSupplier",
            as: "deliveryDetails"
        }}
    ]
    const supplier = await Supplier.aggregate(aggregate) 
    res.send(supplier)
})

router.post('/deliveryTime', async(req,res)=>{
    const {codSupplier} = req.body
    const {codComponent} = req.body
    var exists = await DeliveryTime.exists({codSupplier:codSupplier,codComponent:codComponent})
    if (exists){
        await DeliveryTime.update({codSupplier:codSupplier,codComponent:codComponent},req.body)
    }else{
        const delivery = new DeliveryTime(req.body)
        await delivery.save()
    }
    res.send(delivery)
})

router.post('/inventoryMovement', async(req,res)=>{
    const inventoryMovement = new InventoryMove(req.body)
    await inventoryMovement.save()
    res.send(inventoryMovement)
})

router.get('/inventoryMovement', async(req,res)=>{
    const inventoryMovements = await InventoryMove.find()
    res.send(inventoryMovements)
})

router.get('/order', async(req,res)=>{
    const ordenes = await Order.find()
    res.send(ordenes)
})

router.post('/order',async(req,res)=>{
    //Alogritmos para generar orden
})
module.exports = router