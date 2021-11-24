require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECERET_KEY)
const express = require('express')
const bodyParser = require("body-parser")
const app = express()



//middleware
// app.use(express.json())
app.use(express.static('public'))

//database 
const store_products = new Map([
    [1,{priceincents:1000,name:"ahmed"}],
    [2,{priceincents:2000,name:"raza"}]
]) 

//routes
app.post('/create-checkout-session',express.json({type: 'application/json'}),async (req,res)=>{
    try{ 
//checkout.sessions.create includes foloowing steps:
// 1---payment.intent.created
// 2---customer.created
// 3---payment.intent.sccessded
// 4---charge.succeded
// 4---checkout.sessions.completed
        const str_pay = await stripe.checkout.sessions.
        create({
            payment_method_types:['card'],
            mode:'payment',
            line_items: req.body.items.map((item)=>{
                const product = store_products.get(item.id)
                return {
                    price_data:{
                        currency:'usd',
                        product_data:{
                            name:product.name
                        },
                        unit_amount:product.priceincents
                        
                    },
                    quantity:item.quantity
                }
            }),//here coming data would be use
            success_url:`${process.env.CLIENT_URL}/success.html`,
            cancel_url:`${process.env.CLIENT_URL}/cancel.html`
        })
        res.json({url:str_pay.url})
        
    }catch(e){
        console.log(e)
        res.status(500).json({error: e.message})
}
})

//route webhook
//step one:identify the event
// Step two: Create a webhook endpoint 
//Stripe sends events to your webhook endpoint as part of a POST request with a JSON payload.
app.post('/webhook',express.raw({type: 'application/json'}),async (req,res)=>{
 try{   

//Step four: Secure your webhooks (recommended) 
//Use webhook signatures to verify that events were sent by Stripe, not by a third party..
//request coming from the stripe webhooks to the webhooks endpoint contains signature in header.
// for varification we need three things
// the raw request payload
// the signature 
// signing seceret


    const payload = req.body
    const sig     = req.headers['stripe-signature'] 
    // Before you can verify signatures, you need to retrieve your endpoint’s secret from your Dashboard’s Webhooks settings.
    const key     = 'whsec_vnVfWIsXyQoyDDvko1ckeM5mutX9bX5U'
    const event   = await stripe.webhooks.constructEvent(payload,sig,key)

// Your endpoint must check the event type and parse the payload of each event. 
// Step three: Handle requests from Stripe    
    switch (event.type) {
        case 'checkout.session.completed':
          const session_1 = event.data.object;
        //you must return a 200 response before updating a customer’s invoice as paid in your accounting system.
          res.send('session_1')
        break;
        case 'checkout.session.expired':
          const session_2 = event.data.object;
          // Then define and call a function to handle the event checkout.session.expired
        break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
 }catch(e){
     res.send(e)
 }
})

app.listen(process.env.PORT || 3000)    