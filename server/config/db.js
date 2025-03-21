import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    const url = `${connection.connection.host}:${connection.connection.port} name: ${connection.connection.name}`;

    console.log(`Mongo Conectado en: ${url}`);
  } catch (error) {
    console.log(`error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;