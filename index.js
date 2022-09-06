import { getData } from "./modules/data.js";
import { readCache, writeCache } from "./modules/cache.js";
import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

class Dog {
  constructor(name, age, breed) {
    this.name = name;
    this.age = age;
    this.breed = breed;
  }
}

const myDog = new Dog("Buddy", 3, "Labrador");
console.log(myDog.age);

//Cache from API requests
let cache = {};
const delay = 15000; //15 seconds
const app = express();
const port = process.env.PORT || 3000;

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

/*
getData().then((data) => {
  console.log(data);
});
getData("1").then((data) => {
  console.log(data);
});

getData().then((data) => {
  console.log(data);
});*/

/* import express from "express";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
const port = 3000;

const delay = 10000;
const cache = new Map();
cleanDatabase();
app.get("/", (req, res) => {
  fs.readFile("cache.txt", function (err, buf) {
    console.log(buf.toString());
  });
  res.send("Hello World!");
});

const products = app.get("/products/:id", async (req, res) => {
  let product = {};
  if (cacheOutdated(parseInt(req.params.id))) {
    console.log("cache outdated");
    product = await fetch("https://dummyjson.com/products/" + req.params.id)
      .then((res) => res.json())
      .then((json) => {
        return json;
      });
    addToCache(product);
  } else {
    console.log("cache valid");
  }
  product = JSON.parse(cache.get(parseInt(req.params.id))).data;
  console.log(cache);
  res.send(product);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function cacheOutdated(id) {
  console.log(cache.has(id));
  if (cache.has(id)) {
    return cache.get(id).expires < Date.now();
  }
  return true;
}

function addToCache(data) {
  cache.set(
    data.id,
    JSON.stringify({ expires: Date.now() + delay, data: data })
  );

  fs.appendFile("cache.json", JSON.stringify(data, null, 2) + ",", (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
}

function cleanDatabase() {
  setTimeout(() => {
    let deletedEntries = 0;
    for (let entry of cache.values()) {
      if (JSON.parse(entry).expires < Date.now()) {
        cache.delete(JSON.parse(entry).data.id);
        deletedEntries++;
      }
    }
    console.log("Deleted " + deletedEntries + " entries");
    cleanDatabase();
  }, delay);
}
 */
