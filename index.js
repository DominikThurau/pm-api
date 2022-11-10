import { getData } from "./modules/data.js";
import { readCache, writeCache } from "./modules/cache.js";
import { writeData } from "./modules/writeData.js";
import * as dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
//import cors from "cors";
import bodyParser from "body-parser";
import Project from "./models/Project.js";
import cors from "cors";
import { registerReadEndpoints } from "./modules/endpoints.js";

dotenv.config();

//Cache from API requests
let cache = {};
const delay = 15000; //15 seconds
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;
//const client = new MongoClient(process.env.DATABASE_URI);
let database;
async function main() {
  try {
    registerReadEndpoints({ app });
    // Connect to the MongoDB cluster
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected correctly to database");

    database = mongoose.connection;
  } catch (e) {
    console.error(e);
  }
}

/*async function listDatabases(client) {
  let databasesList = await mongoose.connection.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}*/

main().catch(console.error);

//Write Data to Database
app.post("/writeData/:collection", async (req, res) => {
  console.log("Endpoint called");
  let collection = database.collection(req.params.collection);
  let data;
  console.log(req.body);

  if (req.body) {
    console.log("Body found");
    data = req.body;
  } else {
    console.log("No body found");
    data = { name: "Dominik Thurau", age: 21, city: "Heidelberg" };
  }

  await writeData(collection, data);
  res.send("Data written to database");
});

//Read Data from Database
/*
app.get("/readData/collection", async (req, res) => {
  console.log("Endpoint called");
  console.log("Endpoint called without id");
  res.send(await readData(database.collection(req.params.collection)));
});*/

//Read Data from Database
/*
app.get("/readData/:id", async (req, res) => {
  console.log("Endpoint called");
  console.log("Endpoint called with id: " + req.params.id);
  res.send(await Project.findById(req.params.id));
});*/

//OnLoad
readCache().then((data) => {
  cache = JSON.parse(data);
  console.log("Cache loaded");
});

app.get("/products/:id", async (req, res) => {
  if (!cacheOutdated()) {
    console.log("Cache valid");
    res.send(cache);
  } else {
    console.log("Cache invalid");
    getData(
      "https://dummyjson.com/products/",
      req.params.id ? req.params.id : ""
    ).then((data) => {
      res.send(data);
      let cacheObject = {
        data: data,
        expires: JSON.stringify(Date.now() + delay),
      };
      writeCache(cacheObject);
      readCache().then((data) => {
        cache = JSON.parse(data);
      });
    });
  }
});

app.get("/cache", (req, res) => {
  readCache().then((data) => {
    console.log(data);
    res.send(data);
  });
});

app.listen(port, () => {
  console.log("Server started on port " + port);
});

function cacheOutdated() {
  if (cache.expires) {
    return cache.expires < Date.now();
  } else {
    return true;
  }
}

//Create project
app.post("/projects/create", async (req, res) => {
  console.log("Create Project Endpoint called");
  const project = await Project.create(req.body);
  console.log(project);

  res.send("Data written to database");
});

//Update project
app.put("/projects/:id/edit", async (req, res) => {
  console.log("Update Project Endpoint called");
  try {
    let project = await Project.findById(req.params.id).update(req.body);
    console.log(project);
    res.send("Data written to database");
  } catch (e) {
    console.log("Error happend:", e);
    res.status(500).send("Error happend");
    res.send("Failed to write data to database");
  }
});

//Find project by id
app.get("/projects/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.send(project);
});

//Get all projects
app.get("/projects", async (req, res) => {
  const project = await Project.find();
  res.send(project);
});
