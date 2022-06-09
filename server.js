const express = require('express')
const dotenv = require('dotenv')
const app = express()
const morgan = require('morgan')
const bodyparser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017'
mongoose.connect(uri)
    .then(db => console.log('DB connected'))
    .catch(err => console.log(err));

dotenv.config({path:'config.env'})

const PORT = process.env.PORT || 8080
const routes = require('./assets/js/routes')

//parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}))

//view engine
app.set('view engine','ejs')

//load assets
app.use('/img', express.static(path.resolve(__dirname,'assets/img')))
app.use('/js', express.static(path.resolve(__dirname,'assets/js')))

app.use('/',routes)
//log request
app.use(morgan('tiny'))

app.get('/',(req,res) =>{
    res.render('index')
})

app.listen(PORT,()=> {console.log(`Server is running on http://localhost:${PORT}`)})