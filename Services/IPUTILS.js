
const {networkInterfaces} = require("os");
class IPUTILS{

    static getintefaceIP = ()=>{
        const nets = networkInterfaces();
        const results = {}
        
        return nets["Wi-Fi"][1].address;

    }
    static getExtension = (filename ,  pattern    )=>{
        const idx = filename.lastIndexOf(pattern);
        if(idx){
            const extension = filename.substring(idx+1 );
            return extension;
        }
        return null;
    }
    
}


module.exports.IPUTILS = IPUTILS;