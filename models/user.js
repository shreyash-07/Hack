import mongoose,{Schema} from 'mongoose';
const { createHmac, randomBytes } = await import('node:crypto');
import {createTokenForUser, validateToken} from '../utils/auth.js';


const userSchema = new Schema({
    fullName:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt:{
        type: String,
       
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    profileImageURL: {
        type: String,
        default: "/public/images/default.jpg",
    },
    role:{
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
},{timestamps: true});

userSchema.pre("save", function (next) {
    const user=this;
    if(!user.isModified("password"))
    return;

    //creating encryption for password using salt and hash
    const salt=randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
                           .update(user.password)
                           .digest("hex");
    
    this.salt = salt;
    this.password = hashedPassword;
    next();


    })

userSchema.static("matchPasswordAndGenerateToken", async function (email,password) {
    const user=await this.findOne({email});
    if(!user) throw new Error("User not found");

    const salt=user.salt;
    const hashedPassword=user.password;

    const userProvided=createHmac("sha256", salt)
    .update(password)
    .digest("hex");
    
    if(hashedPassword!=userProvided) throw new Error("Incorrect Password");

    const token=createTokenForUser(user);
    return token;
});


export const User = mongoose.model("User",userSchema);