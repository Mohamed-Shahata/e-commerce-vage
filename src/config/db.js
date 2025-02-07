import mongoose from "mongoose";

const connectionDB = async () => {
  return mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connection DB successfully"))
    .catch((err) => console.log("Error connection DB: ", err))
};

export default connectionDB;