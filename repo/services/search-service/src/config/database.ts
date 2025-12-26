import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/ecommerce';

export const connectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

export default mongoose;
