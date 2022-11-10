import axios from "axios";
import mongoose from "mongoose";
import Project from "../models/Project.js";

export async function writeData(collection, data) {
  collection.insertOne(data);
  console.log("Data written to database");
}

export async function readData(collection, id) {
  if (id) {
    console.log(id);
    let data = await Project.findById(id);
    console.log("Data read from database", data);
    return data;
  } else {
    return await collection.find().toArray();
  }
}
