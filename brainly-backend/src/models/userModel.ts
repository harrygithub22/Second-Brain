//create user models and Schema here 

import {model , Schema} from 'mongoose';

// mongoose.connect("mongodb://localhost:27017/Brainly")

const UserSchema = new Schema({
    username: {type:String, unique: true},
    password:String
})

export const UserModel = model("User", UserSchema)