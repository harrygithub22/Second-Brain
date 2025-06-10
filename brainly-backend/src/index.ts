import express from 'express'
import mongoose from 'mongoose'

import jwt from 'jsonwebtoken'
import {JWT_PASSWORD, MONGO_URL} from './config'

import { UserModel } from './models/userModel'    

import { userMiddleware } from './middlewares/UserMiddleware'

import dotenv from 'dotenv'
import { ContentModel } from './models/contentModel'
dotenv.config()

const app = express()
app.use(express.json())

app.post("/api/v1/signup", async(req,res) =>{
    //Todo zod validation, hash the password
    const username = req.body.username
    const password = req.body.password

try {
        await UserModel.create({
            username:username,
            password:password
        })
        res.json({
            message:"User Signed Up"
        })
} catch (error) {
    res.status(411).json({
        message: "User already exist"
    })
    
}
})

app.post("/api/v1/signin", async(req,res) =>{
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password
    })

    if(existingUser){
        const token = jwt.sign({
            id:existingUser._id
        },JWT_PASSWORD)

        res.json({
            token
        })
    }else{
        res.status(403).json({
            message:"Incorrect Credentials"
        })
    }

})

app.post("/api/v1/content",userMiddleware, (req,res) =>{
    const link = req.body.link
    const type = req.body.type
    ContentModel.create({
        link, 
        type,
        //@ts-ignore
        userId: req.userId,
        tags:[]
    })
})

app.get("/api/v1/content",userMiddleware, async(req,res) =>{
    const userId = req.userId;
    const content = await ContentModel.find({
        userId:userId
    })

    res.json({
        content
    })

})
app.delete("/api/v1/content", (req,res) =>{

})

app.post("/api/v1/brain/share",(req,res)=>{
    
})
app.get("/api/v1/brain/:shareLink", (req,res)=>{

})

;(async function (){
    await mongoose.connect(MONGO_URL)
    app.listen(3000, ()=>{
        console.log("Server running on port 3000")
    })

})()