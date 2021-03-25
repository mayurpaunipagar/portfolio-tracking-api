//creating express app
const express = require("express");
const app = express();
app.use(express.json());

//connecting to mongodb
const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://user:userpassword@meditation-community-ap.vgg6t.mongodb.net/portfolioDB?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.Error("Error: " + e);
  });
//creating user
const userSchemaObj = {
  username: String,
  password: String,
  fullName: String,
  protfolio: [],
};
const securityObj = {
    username:String,
  tickerSymbol: String,
  avgBuyPrice: Number,
  shares: Number,
};
const userSchema = new mongoose.Schema(userSchemaObj);
const securitySchema = new mongoose.Schema(securityObj);

const userModel = mongoose.model("userList", userSchema);
const securityModel = mongoose.model("securities", securitySchema);

userModel
  .findOne({ username: "mayur" })
  .then((r) => {
    if (!r) {
      //if null create the user
      const newUser = userModel({
        username: "mayur",
        password: "mayur123",
        fullName: "Mayur Paunipagar",
      });
      newUser.save();
    }
  })
  .catch((e) => {
    console.error(e);
  });

//initialize portfolio
securityModel.findOne({}).then((r) => {
  if (!r) {
    const security1=securityModel({
      "username":"mayur",
      "tickerSymbol": "TCS",
      "avgBuyPrice": 1833.45,
      "shares": 5,
    });``
    security1.save();
    const security2=securityModel({
        "username":"mayur",
        "tickerSymbol": "WIPRO",
        "avgBuyPrice": 319.25,
        "shares": 10,
      });
      security2.save();
      const security3=securityModel({
        "username":"mayur",
        "tickerSymbol": "GODREJ",
        "avgBuyPrice": 535.00,
        "shares": 2,
      });
      security3.save();
  }
}).catch((e) => {
    console.error(e);
  });




//adding trades
app.post('/buy',async (req,res)=>{
    const {noOfShares,amount,tickerSymbol,username}=req.body;
    
    const security= await securityModel.findOne({username,tickerSymbol});
    const {avgBuyPrice,shares}=security;
    const newPrice=((avgBuyPrice*shares)+(amount*noOfShares))/(shares+noOfShares);
    const correctPrice=Math.floor(newPrice*100)/100;
    await securityModel.updateOne({username,tickerSymbol},
        {
            shares:shares+noOfShares,
            avgBuyPrice:correctPrice
        });
    const updated= await securityModel.findOne({username,tickerSymbol});
    res.send(updated);
})
app.post('/sell',async (req,res)=>{
    const {noOfShares,tickerSymbol,username}=req.body;
    const security= await securityModel.findOne({username,tickerSymbol});
    const {shares}=security;
    if(noOfShares>shares){
        res.send({err: "not have enough shares"});
    }else{
        await securityModel.updateOne({username,tickerSymbol},
            {
                shares:shares-noOfShares,
            });
        const updated= await securityModel.findOne({username,tickerSymbol});
        res.send(updated);
    }
   
})

//Fetch portfolio
app.get('/portfolio',async (req,res)=>{
    const allSecurities1=await securityModel.find({});
    const allSecurities=allSecurities1.map((r)=>{
        const obj={
            "tickerSymbol": r.tickerSymbol,
            "avgBuyPrice": r.avgBuyPrice,
            "shares": r.shares, 
        }
        return obj;
    })
    res.send(allSecurities);
})

app.get("/", (req, res) => {
  res.send("Welcome to portfolio tracking api");
});
app.listen(process.env.PORT || 9000, () => {
  console.log("listening @ ", process.env.PORT || 9000);
});
