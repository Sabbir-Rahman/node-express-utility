const express = require('express')
const bodyParser = require('body-parser')
const SSLCommerzPayment = require('sslcommerz').SslCommerzPayment
const app = express()

require('dotenv').config()

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())


const port = 5000


app.listen(port,()=>{
    console.log('Srver')
})