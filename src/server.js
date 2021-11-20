require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECERET_KEY)
const express = require('express')
const app = express()

//middleware
app.use(express.json())
app.use(express.static('public'))

//database 
const store_products = new Map([
    [1,{priceincents:1000,name:"ahmed"}],
    [2,{priceincents:2000,name:"raza"}]
]) 
//routes
app.post('/create-checkout-session',async (req,res)=>{
    res.send('hello')
//     try{ 
//         const str_pay = await stripe.checkout.sessions.
//         create({
//             payment_method_types:['card'],
//             mode:'payment',
//             line_items: req.body.items.map((item)=>{
//                 const product = store_products.get(item.id)
//                 return {
//                     price_data:{
//                         currency:'usd',
//                         product_data:{
//                             name:product.name
//                         },
//                         unit_amount:product.priceincents
                        
//                     },
//                     quantity:item.quantity
//                 }
//             }),//here coming data would be use
//             success_url:`${process.env.CLIENT_URL}/success.html`,
//             cancel_url:`${process.env.CLIENT_URL}/cancel.html`
//         })
//         res.json({url:str_pay.url})
        
//     }catch(e){
//     res.status(500).json({error: e.message})
// }
})

//route webhook
app.post('/webhook',express.raw({type: 'application/json'}),(req,res)=>{
    console.log('lllll')
    const sig = req.body
    try {
        events = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
        
      }
    switch(events.type){
        case 'checkout.session.completed':
            const session = events.data.object;
            console.log('PaymentIntent was successful!');
            break;
        case 'payment_method.attached':
            const paymentMethod = events.data.object;
            console.log('PaymentMethod was attached to a Customer!');
            break;
        default:
            console.log(`Unhandled event type ${events.type}`);
    }
    response.json({recieved:true})

})

app.get('/kk',(req,res)=>{
    res.send('kkkk')
})

app.listen(process.env.PORT || 3000)    