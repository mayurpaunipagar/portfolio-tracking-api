const express=require('express');
const app=express();
app.listen(process.env.PORT || 9000,()=>{
    console.log("listening @ ", (process.env.PORT || 9000));
})