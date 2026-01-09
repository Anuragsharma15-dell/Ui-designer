import mongoose from 'mongoose';

export const Conncttodb = async ()=>{
    try {
        const connect  = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB ${connect.connection.host}`);
        
    } catch (error) {
        console.log(`Error connecting to MongoDB ${error.message}`);
        process.exit(1);
    }
}