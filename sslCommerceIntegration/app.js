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

app.get("/ssl-request", async (req, res, next) => {

    
    const data = {
        total_amount: req.query.taka,
        currency: 'BDT',
        tran_id: 'REF123',
        success_url: 'http://127.0.0.1:5000/success',
        fail_url: 'http://127.0.0.1:5000/fail',
        cancel_url: 'http://127.0.0.1:5000/cancel',
        ipn_url: 'http://127.0.0.1:5000/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'cust@yahoo.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
        multi_card_name: 'mastercard',
        value_a: 'ref001_A',
        value_b: 'ref002_B',
        value_c: 'ref003_C',
        value_d: 'ref004_D'
    };

    
    const sslcommer = new SSLCommerzPayment(process.env.STORE_ID,process.env.PASSWORD, false) //true for live default false for sandbox
    sslcommer.init(data).then(data => {
        
        //process the response that got from sslcommerz 
        //https://developer.sslcommerz.com/doc/v4/#returned-parameters

        if(data?.GatewayPageURL){
            return res.status(200).redirect(data?.GatewayPageURL)
        }else{
            return res.status(400).json({'message':'Session fail'})
        }
        
    });
    
})

app.post("/success", async(req,res)=>{
    console.log(req.body)
    return res.status(200).json({
        data : req.body
    })
})


app.post("/fail", async(req,res)=>{
    return res.status(400).json({
        data : req.body
    })
})


app.post("/cancel", async(req,res)=>{
    return res.status(400).json({
        data : req.body
    })
})


app.post("/ipn", async(req,res)=>{
    return res.status(400).json({
        data : req.body
    })
})

app.listen(port,()=>{
    console.log('Srver')
})