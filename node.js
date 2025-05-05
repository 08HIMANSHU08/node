
// end point login
const express = require('express')
const joi = require('joi')
const JWT  =require('jsonwebtoken')
const {Sequelize, DataTypes} = require('sequelize')
const app = express()

const port=4000;
app.use(express.json())
// for db connection
//
const sequelize = new Sequelize('node','root','root',{
    host:'localhost',
    dialect:'mysql'
})
// db model

const nodeProject = sequelize.define('Node',{
    //name,phoneNumber,email,password
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    phoneNumber:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

const schema = joi.object({
    name: joi.string().min(5).max(10).required(),
    phoneNumber: joi.number().max(10).required(),
    email:joi.string().email().required(),
    password:joi.string().min(8).required()
})

app.post('/login',async (req,res)=>{
    // login pass with validation return JWT token{name}
    // 
    console.log(req.body)
    const { name,phoneNumber, email,password} = req.body
    const {error, data }=schema.validate(req.body)
    //return JWT with name
    if(error){
        res.status(400)
    }
    const secret  = name
    const jwtToken = JWT.sign(name,secret)
    const db = await nodeProject.create({name,phoneNumber,email,password})
    // save data to DB
    return res.status(200).json({data:jwtToken})
})
// when a enter a user with phone number and password return already login
// when login succ:- login successfull
// when login failed return login failed try again

//table:- for both register and login table must contain name,email,password,phonenumber
app.post('/loginCheck' ,async(req,res)=>{
try{
    const {phoneNumber,password}=req.body
    console.log(phoneNumber,password)
    const findDB = await nodeProject.findOne({where:{phoneNumber}})
    if(!findDB){
        res.status(400).json({message:"Number does not exist"})
    } 
    console.log(findDB.dataValues.password)

    if(findDB.dataValues.password == password && findDB.dataValues.phoneNumber==phoneNumber){
        return res.status(201).json({message:"You are login"})
    } else if(findDB.dataValues.password!=password){
        return res.status(400).json({message:'password is wrong'})
    } else if(findDB.dataValues.phoneNumber!=phoneNumber){
        return res.status(400).json({message:'phoneNumber is not'})
    }
    
}catch(err){
    res.status(400)
}
})

sequelize.sync().then(()=>{
    app.listen(port, ()=>{
        console.log('server start')
    })
})
