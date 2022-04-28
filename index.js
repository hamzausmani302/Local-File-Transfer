
// start server make routes


const {IPUTILS}=  require(__dirname + "/Services/IPUTILS");
const dotenv = require("dotenv");
const express= require("express")
const App = express()
const IP_ADDR = IPUTILS.getintefaceIP()


App.get("/" , (req , res)=>{
    const ip = IPUTILS.getintefaceIP();
    res.send(ip);
})


App.listen( 3000 , ()=>{
    console.log("connected");
});






