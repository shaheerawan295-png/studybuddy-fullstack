import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
        const{name,email,password}=await req.json();
        if(!name||!email||!password){
            return NextResponse.json({error: "Required"},{status:400});
        }
        await connectDB();
        const existingUser =await User.findOne({email});
        if(existingUser){
            return NextResponse.json({error : "Email already registered.."},{status:400});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({name,email,password:hashedPassword});
        return NextResponse.json({message:"Account created successfully"},{status:201})
    }catch{
        return NextResponse.json({error:"Something went wrong!"},{status:500});
    }
}
