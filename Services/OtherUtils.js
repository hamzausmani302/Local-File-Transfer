// const { Template } = require("ejs");
const fs = require("fs");
const path = require("path")
const FileUtils = require("./FileUtils");
const root_path = path.resolve(__dirname , "../SharedDirectory")
let parentTemplate = "<h4>Shared Files</h4>{content}"
let Template = `<img src='/Services/assets/diricon.png' />  <a href='/files/{filename}'> {filename} </a><br />`
class OtherUtils{
    static transverseDirectory = (_path , arr  ,pattern)=>{
        
        const files = fs.readdirSync(_path);
        
        for (let file of files){
            var stats = fs.statSync(path.resolve(_path,file ));
            
            
            if(stats.isFile() &&   file.toLowerCase().search(pattern.toLowerCase()) != -1){
                //         // console.log("dad");
                let fname = `${_path}\\${file}`
                fname = fname.replace(root_path , "");      
                fname = fname.replace("\\", "");  
                fname = fname.replaceAll("\\", "/");  
                    
                      
                arr.push(fname);

            }else if(stats.isDirectory()){
                this.transverseDirectory(path.resolve(_path , file)  , arr , pattern);
            }
        }
    }
    static getList = (data) =>{
        console.log(data);
        let str = "";
        for(let i = 0 ; i < data.length ; i++){
            
            //filter out dangerous characters from filename

            let temp = Template.replaceAll("{filename}" , data[i])
            str += temp;
        }
        
        str = parentTemplate.replace("{content}" , str);
        return str;
    }
    
    
}

module.exports.OtherUtils = OtherUtils