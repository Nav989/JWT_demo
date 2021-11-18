const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser= require('body-parser')
const jwt =require('jsonwebtoken');


const jwtkey="nav123";


//connection 
mongoose.connect("mongodb://localhost:27017/brainvire",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log("connected with mongodb")
}).catch((err)=>{
    console.log(err)
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())


const ProductSchema = new mongoose.Schema({
id:Number,
name:String,
email:String,
password:String
})

const Product =new mongoose.model("jwt",ProductSchema);


app.get('/',async(req,res)=>{


    res.send({message:"get api"})

})


app.post('/register',async(req,res)=>{

    const newproduct= await Product.create(req.body)

    // res.status(201).json({success:true,newproduct})


    jwt.sign({newproduct},jwtkey,{expiresIn:'600s'},(err,token)=>{

        // newproduct.token = token;

        res.status(201).json({success:newproduct,token})
        console.log(token)
    })
})


app.post('/login',async(req,res)=>{
    
   const findOneProduct= await Product.findOne({email:req.body.email})

   console.log(findOneProduct);

   res.json(findOneProduct)
})

function verifyT(req,res,next){
    const bearerHeader =req.headers['authorization']

    if(typeof bearerHeader!== "undefined"){
        const bearerToken=bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
    }
    else{
        res.status(403).json({message:"error"})
    }
}

app.post('/login/users',verifyT,(req,res)=>{
   
//    const findPro=await Product.find()

//    res.status(200).json(findPro)

//    res.status(400).json({message:"error"})

const token = req.body;
    console.log('token: ' + token);


const x = jwt.verify(token,jwtkey,(err,authdata)=>{
        if(err){
            throw err;
        }else{

            res.status(200).json({message:" get user data", authdata});
        }
        
    });

    console.log(x);
    if (x != true) {
        res.json({ auth: false });
    } else {
        res.json({ auth: true });
    }

})


app.listen(4000,()=>{
    console.log("server is working")
})



// const verifyToken =(req,res,next)=>{

//     const bearerHeaders=req.headers["Authorization"]; 

// //   console.log(bearer[1]);
// //   req.token=bearer[1];
 

//     if(typeof bearerHeaders !== "undefined"){
      
//       res.send("authorized");


//     // const bearer=bearerHeaders.split()

//     // console.log(bearer[1]);
//     // req.token=bearer[1];

//     //   jwt.verify(req.token,jwtkey,(err,authdata)=>{
//     //     if(err)throw err;
//     //     next();
//     // })

//     }else{
//         res.send({message:"authorization not define"})

//     }
// }



