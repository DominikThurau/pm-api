import { readFile, writeFile } from "fs/promises";

export async function writeCache(data) {
  await writeFile("./cache.json", JSON.stringify(data));
}

export async function readCache() {
  let cache = await readFile("./cache.json", "utf-8");
  return cache;
}
