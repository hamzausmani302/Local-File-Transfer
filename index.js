const express = require("express");
let ejs = require('ejs');
const FileUtils = require("./Services/FileUtils");

const multer = require('multer');
const path = require("path")

var socketVar = null;
var sockets_table= {};
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

const { OtherUtils } = require("./Services/OtherUtils");
const { DBUtils } = require("./Services/DBUtils");
const { Auth } = require("./Services/Authentication");
app.set('socketio' , io);
app.set("view-engine" , 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(siofu.router);

app.post('/profile', upload.single("File"), function (req, res, next) {
    // req.body contains the text fields
    console.log(path.resolve(__dirname , "SharedDirectory"))
    FileUtils.ListFiles().then(data=>{
        
        res.render(__dirname + "/View/Home.ejs" , {content : "File Uploaded\n "+ OtherUtils.getList(data)});
        
    }).catch(err=>{
        console.log(err.message);
        res.render(__dirname + "/View/Home.ejs" , {content : "Error Uploading File\n "});
    })
    
})
app.get('/', (req, res) =>{
    res.render(__dirname + "/View/index.ejs" , {error:""});
    
});

app.get('/files/:filename' , (req,res)=>{
    // res.send(req.params.filename);
    //check if file exxists
    //if equest file is a direcoty send contents of file inside direcotory
    
    res.sendfile(__dirname + `/SharedDirectory/${req.params.filename}`);
});

app.post("/login" , (req,res)=>{
    const {username , password} = req.body;
    Auth.Login(username , password)
    .then(data=>{
        console.log(data)
        console.log(`client connected with IP=${req.socket.localAddress}`);
        FileUtils.ListFiles()
        .then((data)=>{
            res.render(__dirname + "/View/Home.ejs" , {
                content : OtherUtils.getList(data)
            })
            return ;
        }).catch((err)=>{
            res.send(err.message)
        });
        
    }).catch(err=>{
        res.render(__dirname + "/View/index.ejs" ,{
            error : "Invlaid username and password"
        } )
    
    })
    // if(Auth.Login(username , password)){
        
        
       
    
    
    // // console.log(`Login with username = ${req.body.username} password= ${req.body.password} `)
});

//Whenever someone connects this gets executed
io.on('connection',  function(socket) {
    const ipv4 = socket.request.connection.remoteAddress;
    const id= socket.id;
    console.log('A user connected' + ipv4 , id);
    
    //    var uploader = new siofu();
//    uploader.dir = "/SharedDirectory";
//    uploader.listen(socket);
    socketVar = socket;
    sockets_table[ipv4] = [socket , id];
   socket.emit("communication" , `<br /><p style="color:green;">CONNECTED TO SERVER</p>`);
    //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
         
    console.log('A user disconnected');
    // socket.emit("communication" );
   
   });
   socket.on("file_upload" , function(message){
       console.log(message);
        const parsed_msg = JSON.parse(message)
       const filename = parsed_msg.filename;
       const data = parsed_msg.data;
       
        const extension = FileUtils.getExtension(filename , ".");

        const response  = FileUtils.AddFile(filename , data , extension);

        console.log(response);
   })

   
});

http.listen(3000, function() {
    FileUtils.CheckAndAddFolder()
    
    console.log("Requirements fullfilled");
    console.log('listening on *:3000');
});

