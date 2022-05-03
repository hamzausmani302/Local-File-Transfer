const express = require("express");
let ejs = require('ejs');
const FileUtils = require("./Services/FileUtils");

const multer = require('multer');
const path = require("path")

var socketVar = null;
var sockets_table= {};
var storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
       let loc = req.cookies.path;
       
       cb(null, path.resolve(__dirname , "SharedDirectory/"+ loc));    
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
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { AUTH_MIDDLE } = require("./Services/MiddleWare/Auth");
dotenv.config();
app.set('socketio' , io);
app.set("view-engine" , 'ejs')

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}));
app.use(siofu.router);

app.post('/profile', AUTH_MIDDLE, upload.single("File"), function (req, res, next) {
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

app.post("/addUser" , (req,res)=>{
    const {user_name , pass_word , user_type} = req.body;
    let userType = user_type.toLowerCase();
    FileUtils.ListFiles().then(data=>{
        console.log("files",data);
        DBUtils.addUser(user_name , pass_word , userType).then(data1=>{
            console.log("new data",data1);
            res.render(__dirname + "/View/Admin.ejs" , {content :  OtherUtils.getList(data) , success:"Successfully uploaded file",err:""});
        
        }).catch(err1=>{
            console.log(err1.message);
            
            res.render(__dirname + "/View/Admin.ejs" , {content : + OtherUtils.getList(data) , success:"",err:"Error Adding user"});

        })
        
    }).catch(err=>{
        console.log(err.message);
        res.render(__dirname + "/View/Admin.ejs" , {content : "Error Fetching files"});
    })
    
})
app.get('/files/:filename' , AUTH_MIDDLE, (req,res)=>{
    
    // res.send(req.params.filename);
    //check if file exxists
    //if equest file is a direcoty send contents of file inside direcotory
    // const _path = __dirname + `/SharedDirectory/${req.params.filename}`;
    if(FileUtils.checkDirectory(req.params.filename)){
        //edit home and send new response through socket 
        FileUtils.ListFiles(req.params.filename).then(data=>{
            // console.log("data",data);
            
            res.render(__dirname + "/View/Home.ejs" , {content : OtherUtils.getList(data)})    
            return;
        }).catch(err=>{
            
            console.log("Error",err.message)
        })
        
        
    }
    
    
    res.sendfile(__dirname + `/SharedDirectory/${req.params.filename}`);
});

app.post("/login" , (req,res)=>{
    const {username , password} = req.body
    Auth.Login(username , password)
    .then(data=>{
        console.log(data)
        console.log(`client connected with IP=${req.socket.localAddress}`);
        FileUtils.ListFiles()
        .then((data1)=>{
            res.setHeader("Set-Cookie" , `Authentication=${process.env.COOKIE};`);
            if(data.role === "admin"){
                res.render(__dirname + "/View/Admin.ejs" , {
                    content : "Shared Space Files<br />"/** +OtherUtils.getList(data1)**/,
                    success : "",
                    err : ""

                })
            }else{
                res.render(__dirname + "/View/Home.ejs" , {
                    content : "Shared Space Files<br />"/**+OtherUtils.getList(data1)**/
                })
            }
            
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
    socket.on("DATA_TRANSFER" , (msg)=>{
        let folder = msg;
        console.log(folder);
        FileUtils.ListFiles(folder).then(data=>{
            
            socket.emit("communication" ,{status : "COMM" , data : data} );
            
        }).catch(err=>{
            // socket.emit("communication" , "Cannot Get a List of files"+err.message);
            socket.emit("communication" , "Cannot Get a List of files"+err.message);
        })
    })

    socket.on("create_folder" , (msg)=>{
        //filter filename

        const res = FileUtils.createFolder(msg);
        const response = {status : 'create_folder' , data : res};
        socket.emit("communication" , response );

    })
    //    var uploader = new siofu();
//    uploader.dir = "/SharedDirectory";
//    uploader.listen(socket);
FileUtils.ListFiles().then(data=>{
    socket.emit("communication" ,{status:"startup" , data:"Connection Established"} );
    
    socket.emit("communication" ,{status : "COMM" , data : data} );
    
}).catch(err=>{
    socket.emit("communication" , "Cannot Get a List of files"+err.message);
})
    


    //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
         
    console.log('A user disconnected');
    // socket.emit("communication" );
   
   });
   socket.on("search" , (msg)=>{
    console.log(msg);
    FileUtils.FilterFiles(msg).then(data=>{
        console.log("data", data);
        socket.emit("searchFilter" , data);
    }).catch(err=>{
        console.log(err);
    })
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

