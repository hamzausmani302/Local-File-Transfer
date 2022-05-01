const express = require("express");
let ejs = require('ejs');
const FileUtils = require("./Services/FileUtils");

const multer = require('multer');
const path = require("path")
let socketVar = null;
var storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
       cb(null, path.resolve(__dirname , "SharedDirectory"));    
    }, 
    filename: function (req, file, cb) { 
       cb(null , file.originalname);   
    }
 });

 
const upload = multer({storage : storage})

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const siofu = require('socketio-file-upload');

app.set("view-engine" , 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(siofu.router);

app.post('/profile', upload.single("File"), function (req, res, next) {
    // req.body contains the text fields
    console.log(path.resolve(__dirname , "SharedDirectory"))
    FileUtils.ListFiles().then(data=>{
        
        res.render(__dirname + "/View/Home.ejs" , {content : "File Uploaded\n "+JSON.stringify(data)});
        
    }).catch(err=>{
        console.log(err.message);
        res.render(__dirname + "/View/Home.ejs" , {content : "Error Uploading File\n "+JSON.stringify(data)});
        
    })
    
})
app.get('/', (req, res) =>{
   res.render(__dirname + "/View/index.ejs" , {error:""});
});

app.post("/login" , (req,res)=>{
    const {username , password} = req.body;
    if(username=="fast" && password == "fast"){
        FileUtils.ListFiles()
        .then((data)=>{
            console.log("data",data);
            res.render(__dirname + "/View/Home.ejs" , {
                content : JSON.stringify(data)
            })
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
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected' );
//    var uploader = new siofu();
//    uploader.dir = "/SharedDirectory";
//    uploader.listen(socket);
    socketVar = socket;

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      
    console.log('A user disconnected');

   });
   socket.on("file_upload" , function(message){
       console.log(message);
        const parsed_msg = JSON.parse(message)
       const filename = parsed_msg.filename;
       const data = parsed_msg.data;
       
        const extension = FileUtils.getExtension(filename , ".");

        const response  = FileUtils.AddFile(filename , data , extension);

        socket.emit("communication" , response);
        console.log(response);
   })
});

http.listen(3000, function() {
    FileUtils.CheckAndAddFolder()
    console.log("Requirements fullfilled");
    console.log('listening on *:3000');
});