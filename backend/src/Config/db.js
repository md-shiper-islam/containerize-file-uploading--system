const mongoose=require("mongoose")
const {Db_URI}=require("../secret")


const mongoDatabase=async()=>{
    try {
        await mongoose.connect(Db_URI);
        console.log("mongodb database is Connection Sucessfully")
        mongoose.connection.on('error',(error)=>{
            console.error("the mongodb connecction error",error)
        })
        
    } catch (error) {
        console.error("can not the connet Db", error.toString());
        
    }
};

module.exports=mongoDatabase