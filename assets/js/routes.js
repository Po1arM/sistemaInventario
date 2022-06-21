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

//Listar todos los componentes
router.get('/components/list', async(req,res)=>{
    const components = await Component.find()
    res.send(components)
})

//Listar un componente dado un id
//Tambien lista su relacion con tiempo de entrega
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

//Modifica un componente
/*Body
 * codComponent: cod,
    description: description,
    unit: unit,
    store:[{
        storeCode: storeCode,
        storeBalance: amount
    }]
 */
router.put('/components/:id', async(req,res)=>{
    const {id} = req.params
    await Component.update({codComponent:id},req.body)
    res.send(component)
})

//Crear un componente
/*Body
 * codComponent: cod,
    description: description,
    unit: unit,
    store:[{
        storeCode: storeCode,
        storeBalance: amount
    }]
 */
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

//Crear un nuevo suplidor
/*codSupplier: codSupplier,
    name: name,
    rnc: rnc,
    city: city,
    address: address
     */
router.post('/suppliers', async(req,res)=>{
    const supplier = new Supplier(req.body)
    await supplier.save()
    res.send(component)
})

//Listar los suplidores
router.get('/suppliers/list', async(req,res)=>{
    const suppliers = await Supplier().find()
    res.send(suppliers)
})

//Buscar un suplidor y los componentes que entrega
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

//Registrar el tiempo de envio para un suplidor y un componente
//Si ya existe, entonces se actualiza
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

//Listar todos los tiempos de envio
router.post('/inventoryMovement', async(req,res)=>{
    const inventoryMovement = new InventoryMove(req.body)
    await inventoryMovement.save()
    res.send(inventoryMovement)
})

//Listar todos los movimientos de inventario
router.get('/inventoryMovement', async(req,res)=>{
    const inventoryMovements = await InventoryMove.find()
    res.send(inventoryMovements)
})

//Listar todas las ordenes
router.get('/order', async(req,res)=>{
    const orders = await Order.find()
    res.send(orders)
})

//Listar las ordenes en un rango determinado
router.get('/order/inRange', async(req,res)=>{
    const {fechaInicio,fechaFin} = req.body
    const aggregate = [
        {$match:{
            orderDate:{
            $gte: ISODate(fechaInicio),
            $lt: ISODate(fechaFin) 
        }
        }},
        {$lookup:{
            from: "Orders",
            localField: "orderNumber",
            foreignField:"orderNumber",
            as: "orderDetails"
        }

        }]
    const orders = await Order.aggregate(aggregate)
    res.send(orders)
})

//Listar las ordenes para un suplidor en especifico
router.get('/order/supplier/:id', async(req,res)=>{
    const {id} = req.params
    const aggregate = [
        {$match:{
            orderDate:{
            $gte: ISODate(fechaInicio),
            $lt: ISODate(fechaFin) 
        }
        }},
        {$lookup:{
            from: "Orders",
            localField: "orderNumber",
            foreignField:"orderNumber",
            as: "orderDetails"
        }
        }]
    const orders = await Order.aggregate(aggregate)
    res.send(orders)
})

//Crear la orden de manerea automatica
router.post('/order',async(req,res)=>{
    var { orderDate, components} = req.body;
    orderDate = new Date(orderDate);
    try {
        var suplidores = []
        for (i = 0; i < articulosNecesarios.length; i++) {
            aux = await suplidorCercano(articulosNecesarios[i].component, orderDate)
            suplidores.push(aux);
        }

        var articuloSuplidor = []
        for (i = 0; i < suplidores.length; i++) {
            var suplidor;
            for (j = 0; j < articulosNecesarios.length; j++) {
                if (suplidor === null) 
                    suplidor = suplidores[i].codSupplier
                
                auxArticulo = {
                    codComponent: articulosNecesarios[j].component,
                    amount: articulosNecesarios[j].amount,
                    price: articulosNecesarios[j].precio,
                }
                articuloSuplidor.push(auxArticulo);
                
            }
            const newOrder = new Order({
            detailCod: detailCod,
            codSupplier: suplidor,
            orderDate: orderDate,
            })
            await newOrder.save();
            numeroOrden++;
            articuloSuplidor = [];
        
        }
    } catch (err) {
        console.error(err)
        res.status(500).json(err);
    }
})

module.exports = router