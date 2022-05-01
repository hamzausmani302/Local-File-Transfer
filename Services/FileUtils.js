const fs = require("fs")
const path =require("path");

const root_path = path.resolve(__dirname , "../SharedDirectory")

const result = {error : 0}; 
class FileUtils{

    static ReadFile = (filename)=>{
        const data = fs.readFileSync(path.resolve(root_path , `${filename}`))
        console.log(data);
        return data;
    }
    static CheckAndAddFolder = ()=>{
        //chcek whether folder exist
        if (!fs.existsSync(root_path)) {
              fs.mkdirSync(root_path );
        } 
        
        //if not then create folder

        //else leave


    }
    static getExtension = (filename ,  pattern    )=>{
        const idx = filename.lastIndexOf(pattern);
        if(idx){
            const extension = filename.substring(idx+1 );
            return extension;
        }
        return null;
    }
    
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


    static AddFile = (filename , data , extension)=>{
        try{    
            const path = root_path + '\\' + filename;
            console.log(path)
        fs.writeFileSync(path , data );
            return "Added File Successfully";
    }catch(err){
            return err;
        }
    }
    static MakeDirectory = ()=>{

        
    }



}


module.exports = FileUtils