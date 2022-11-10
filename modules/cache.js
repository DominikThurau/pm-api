import { readFile, writeFile } from "fs/promises";

let cache = new Map();

export async function writeCache(key, data) {
  await writeFile("./cache.json", JSON.stringify(data));
}

export async function readCache() {
  cache = await readFile("./cache.json", "utf-8");
  return cache;
}

export async function addToCache(key, data) {
  cache.set(key, data);
  await writeCache(cache);
}

export async function getFromCache(key) {
  cache = await readCache();
  return cache.get(key);
}
