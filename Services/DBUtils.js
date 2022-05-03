
const { info } = require("console");
const fs = require("fs");
const path =require("path");

const root_path = __dirname;

const DB_FILENAME= path.resolve(root_path , "../Database.txt");
class DBUtils{
    static getUsersFromFile = ()=>{
        let DB = [];
        let promise = new Promise((resolve , reject)=>{
            fs.readFile(DB_FILENAME , 'utf-8' , (err , data)=>{
                if(err) reject(err.message);
                let splitted_Data = data.split("\n");
                // console.log(splitted_Data)
                for (let i = 0 ; i < splitted_Data.length;i++){
                    let info = []
                    let user = splitted_Data[i].split(",")
                    for(let j = 0 ; j <  user.length; j++){
                        info.push(user[j].replace("\r" , ""));
                    }
                    DB.push(info);
                }        
                resolve(DB);
            })
        });
        return promise

    }
    static getUser = (id)=>{
        let DB = [];
        let promise = new Promise((resolve , reject)=>{
            fs.readFile(DB_FILENAME , 'utf-8' , (err , data)=>{
                if(err) reject(err.message);
                let splitted_Data = data.split("\n");
                // console.log(splitted_Data)
                for (let i = 0 ; i < splitted_Data.length;i++){
                    let info = []
                    let user = splitted_Data[i].split(",")
                    if(user[0] == id){
                        for(let j = 0 ; j <  user.length; j++){
                            info.push(user[j].replace("\r" , ""));
                        }
                        DB.push(info);
                    }
                    
                }        
                resolve(DB);
            })
        });
        return promise

        
    }
    

    static addUser = (id , password , role)=>{
        let promise = new Promise((resolve , reject)=>{
            DBUtils.getUser(id).then(data=>{
                if(data.length == 0){
                    
                    fs.appendFile(DB_FILENAME , `\n${id},${password},${role}`, (err1 )=>{
                        if(err1) {reject("USER ALREADY EXISTS")}
                        resolve("ADDED SUCCESSFULLY");
                    });
                }else{
                    
        
                }
                
            }).catch(err=>{
                reject(err)
            })

        });
        return promise;
        
    }



}

module.exports.DBUtils = DBUtils;