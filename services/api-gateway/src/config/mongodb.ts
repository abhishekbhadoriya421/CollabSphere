import mongoose from "mongoose";

/**
 * Database connection
 */
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI_PROD || 'mongodb://localhost:27017/collabsphere', { useNewUrlParser: true, useUnifiedTopology: true, } as mongoose.ConnectOptions);
            console.log('MongoDB connected');
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
export default connectDB; 