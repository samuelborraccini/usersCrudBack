import express, { Response, Request } from "express";
import "./db/prismaClient";
import Userrouter from "./routes/userRoutes";
import "dotenv/config";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use("/user", Userrouter);

const server = app.listen(4000, () => {
  console.log("server running...");
});

export default server;
