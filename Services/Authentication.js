const { DBUtils } = require("./DBUtils")

class Authentication{

    static Login = (username , password)=>{
        let promise = new Promise((resolve,reject)=>{
            DBUtils.getUser(username).then(data=>{
               
                if(data.length > 0){
                    
                    if(data[0][1] == password){
                        resolve({"id" : data[0][0] , role : data[0][2]})
                    }
                }
                reject("User not found");
            }).catch(err=>{
                reject(err.message)
            })

        });
        return promise;
    }
}
module.exports.Auth = Authentication;