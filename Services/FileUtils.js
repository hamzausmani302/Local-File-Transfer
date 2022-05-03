const fs = require("fs")
const path =require("path");
const Regex = require("regex");
const { OtherUtils } = require("./OtherUtils");


const root_path = path.resolve(__dirname , "../SharedDirectory")

const result = {error : 0}; 
class FileUtils{
    static createFolder = (foldername)=>{
        try{
        const data = fs.mkdirSync(path.resolve(root_path , foldername))
        return {error:0 , data:data};
        }catch(err){
            return {error :1 , data:err.message};
        }
    }

    static checkDirectory = (_path)=>{
        var stats = fs.statSync(path.resolve(root_path , _path));
        return stats.isDirectory();
    }

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
    
    static ListFiles = (_path=root_path)=>{
        
        let promise = new Promise((resolve , reject)=>{
            if(_path != root_path){
                _path = path.resolve(root_path, _path);
            }
            // console.log(_path);
            fs.readdir(_path, (err , files)=>{
                
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

    static FilterFiles = (pattern , _path1 = root_path)=>{
        let promise = new Promise((resolve , reject)=>{
            let _path = _path1
            if(_path != root_path){
                _path = path.resolve(root_path, _path1);
            }
            console.log(_path);
            // fs.readdir(_path, (err , files)=>{
            //     if(err)reject(err);
                let arr = [];
                OtherUtils.transverseDirectory(_path, arr , pattern)
                console.log(arr);
                resolve(arr);
    
            // })
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