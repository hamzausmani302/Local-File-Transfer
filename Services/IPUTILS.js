
const {networkInterfaces} = require("os");
class IPUTILS{

    static getintefaceIP = ()=>{
        const nets = networkInterfaces();
        const results = {}
        
        return nets["Wi-Fi"][1].address;

    }

}


module.exports.IPUTILS = IPUTILS;