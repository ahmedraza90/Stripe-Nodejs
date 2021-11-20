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
    try{ 
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
app.post('/webhook',express.raw({type: 'application/json'}),async (req,res)=>{
 try{   
    const payload = req.body
    const sig     = req.headers['stripe-signature'] 
    const key     = 'whsec_vnVfWIsXyQoyDDvko1ckeM5mutX9bX5U'
    const event = await stripe.webhooks.constructEvent(payload,sig,key)

    res.json({event})
 }catch(e){
     res.send(e)
 }
    // const sig = req.headers['stripe-signature']
    // try {
    //     events = stripe.webhooks.constructEvent(req.body, sig, 'whsec_dtAr4abS9Z5eyz1zrSQzUm76Pc0v8iyO');
    //   } catch (err) {
    //     return res.status(400).send(`Webhook Error: ${err.message}`);
    // }
    // switch(events.type){
    //     case 'checkout.session.completed':
    //         const session = events.data.object;
    //         console.log('PaymentIntent was successful!');
    //         break;
    //     case 'payment_method.attached':
    //         const paymentMethod = events.data.object;
    //         console.log('PaymentMethod was attached to a Customer!');
    //         break;
    //     default:
    //         console.log(`Unhandled event type ${events.type}`);
    // }
    // res.json({recieved:true})
})

app.listen(process.env.PORT || 3000)    