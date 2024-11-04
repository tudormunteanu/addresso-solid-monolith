import * as fs from "fs/promises";

async function loadCacheFromFile(filename: string): Promise<Map<string, any>> {
  try {
    const data = await fs.readFile(filename, "utf8");
    // Parse JSON into object first, then convert to entries array for Map constructor
    const parsed = JSON.parse(data);
    return new Map(Object.entries(parsed));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return new Map();
    }
    throw error;
  }
}

async function saveCacheToFile(filename: string, cache: Map<string, any>) {
  // Remove append flag 'a+' to overwrite file instead of appending
  await fs.writeFile(
    filename,
    JSON.stringify(Object.fromEntries(cache), null, 2),
  );
}

export { loadCacheFromFile, saveCacheToFile };
