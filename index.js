//Import environment variables
import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
//Import cors and bodyParser;
import bodyParser from "body-parser";
import cors from "cors";

//Import endpoints
import {
  registerPOSTEndpoints,
  registerPUTEndpoints,
  registerGETEndpoints,
} from "./modules/endpoints.js";

import { registerCogoMock } from "./mocks/cogo.js";
import { registerDiasMock } from "./mocks/dias.js";

//Loading environment variables
dotenv.config();

//Configurations for express
const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 4000;
//const client = new MongoClient(process.env.DATABASE_URI);
let database;
export let collection;
async function main() {
  try {
    registerPOSTEndpoints({ app });
    registerPUTEndpoints({ app });
    registerGETEndpoints({ app });
    registerCogoMock(app);
    registerDiasMock(app);
    // Connect to the MongoDB cluster
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected correctly to database");

    database = mongoose.connection;
    collection = database.collection("projects");
  } catch (e) {
    console.error(e);
  }
}

main().catch(console.error);

app.listen(port, () => {
  console.log("Server started on port " + port);
});
app.use(express.static("www"));
