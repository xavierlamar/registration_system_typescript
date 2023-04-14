require("dotenv").config();
import express, { Request, Response } from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";

const app = express();

app.use(express.json());

app.use(router);

const port = config.get("port");

app.get("/",(req:Request,res:Response)=>{
  return res.json({
    status:"success",
  });
});

app.listen(port, () => {
    
  log.info(`App started at http://localhost:${port}`);

  connectToDb();
});
