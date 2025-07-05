import mongoose from 'mongoose';
import 'dotenv/config';
const getConnection = async () => {
    try {
        const mongoUrl = process.env.MONGO_DB_URL;
        const con = await mongoose.connect(mongoUrl);
        console.log('MongoDB connected successfully:', con.connection.host);
        return con;
    }

    catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit the process with failure
    }
}
export default getConnection;