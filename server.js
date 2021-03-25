const express=require('express');
const app=express();
app.get('/',(req,res)=>{
    res.send("Welcome to portfolio tracking api");
}
app.listen(process.env.PORT || 9000,()=>{
    console.log("listening @ ", (process.env.PORT || 9000));
})