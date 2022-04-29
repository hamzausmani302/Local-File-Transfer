const fs = require("fs")
const path =require("path");

const root_path = path.resolve(__dirname , "../SharedDirectory")

const result = {error : 0}; 
class FileUtils{

    static ListFiles = ()=>{
        let promise = new Promise((resolve , reject)=>{
            fs.readdir(root_path, (err , files)=>{
                if(err){
                    result.error = 1 
                    result.msg = err.message
                    reject(err.message)  
                }
                resolve(files)
                return files;
    
            })
        });
        return promise;
    }

    static MakeDirectory = ()=>{

        
    }



}


module.exports = FileUtils