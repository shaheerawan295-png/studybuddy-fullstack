import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache{
    conn: typeof  mongoose | null;
    promise: Promise<typeof mongoose> | null;
}
declare global{
    var mongoose:MongooseCache | undefined;
}
const cached:MongooseCache = global.mongoose ??{conn:null,promise:null};
async function connectDB(){
if(!MONGODB_URI){
     throw new Error("Please define MONGODB_URI in .env.local");
}
if(cached.conn){
    return cached.conn;
}
if(!cached.promise)
{
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
return mongooseInstance;
    });
};
cached.conn=await cached.promise;
global.mongoose=cached;
return cached.conn;
}
export default connectDB;
