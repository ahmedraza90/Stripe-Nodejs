const button = document.querySelector("button")
button.addEventListener("click",async  () => {
try{
            const request = await fetch("/create-checkout-session",{
              method:"POST",
              headers:{
                   "Content-Type":"application/json"
              },
              body:JSON.stringify({
                items:[
                  {id:1,quantity:3},
                  {id:2,quantity:4},
                ],
              }),
            })
            const {url} = await request.json()
            window.location= url
}catch(e){
  console.log(e)
}
})