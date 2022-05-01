// const { Template } = require("ejs");

const FileUtils = require("./FileUtils");

let parentTemplate = "<h4>Shared Files</h4>{content}"
let Template = `<img src='/Services/assets/diricon.png' />  <a href='/files/{filename}'> {filename} </a><br />`
class OtherUtils{

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