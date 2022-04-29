const express = require("express");
let ejs = require('ejs');
const FileUtils = require("./Services/FileUtils");

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.set("view-engine" , 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}));


app.get('/', (req, res) =>{
   res.render(__dirname + "/View/index.ejs" , {error:""});
});

app.post("/login" , (req,res)=>{
    const {username , password} = req.body;
    if(username=="fast" && password == "fast"){
        FileUtils.ListFiles()
        
        .then((data)=>{
            console.log("data",data);
            res.render(__dirname + "/View/Home.ejs" ,{
                content : JSON.stringify(data)
            } )
            return ;
        }).catch((err)=>{
            res.send(err.message)
        });
        
    
       return;
    }
    res.render(__dirname + "/View/index.ejs" ,{
        error : "Invlaid username and password"
    } )

    // console.log(`Login with username = ${req.body.username} password= ${req.body.password} `)
})

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected' );
   

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
   socket.on("message" , function(message){
       console.log(message);
   })
});

http.listen(3000, function() {
    FileUtils.CheckAndAddFolder()
    console.log("Requirements fullfilled");
    console.log('listening on *:3000');
});