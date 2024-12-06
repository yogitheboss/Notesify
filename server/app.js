import mongoose from "mongoose";
import { app } from "./index.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = parseInt(3000, 10);
// On error go to Mongo website and add IP
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: 3000`))
  )
  .catch(() => (error) => console.log(error.message));
