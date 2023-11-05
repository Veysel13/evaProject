import mongoose from "mongoose";

const connection = async () => {
  try {
    await mongoose.connect(
      "mongodb://" + process.env.DB_HOST + "/" + process.env.DB_NAME
    );

    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }
};

export { connection };
