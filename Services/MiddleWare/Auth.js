
COOKIE = ""
const dotenv = require("dotenv");
const path = require("path")
dotenv.config()
function check_Auth(req,res,next){
    const cookie  = req.cookies.Authentication;
    console.log(cookie , process.env.COOKIE ,cookie.length , process.env.COOKIE.length);
    if(cookie === process.env.COOKIE){
        next();
        
    }else{
        res.render(path.resolve(__dirname , "../../View/index.ejs" ), {error : '<p style="color:red;">Not Authenticated..Login First</p>'})
    }
}


module.exports.AUTH_MIDDLE = check_Auth;