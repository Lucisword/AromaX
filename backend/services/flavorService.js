import axios from "axios"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cacheFilePath = path.join(__dirname, "../cache/flavorCache.json")

// Load existing cache
let persistentCache = {}

if (fs.existsSync(cacheFilePath)) {
  const rawData = fs.readFileSync(cacheFilePath)
  persistentCache = JSON.parse(rawData)
}


const BASE_URL = "https://api.foodoscope.com"

export const getSimilarEntities = async (ingredient) => {
  const key = ingredient.toLowerCase()

  // 1️⃣ Check persistent cache first
  if (persistentCache[key]) {
    return persistentCache[key]
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/flavordb/food/by-alias`,
      {
        params: { food_pair: ingredient },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FOODOSCOPE_API_KEY}`
        }
      }
    )

    const data = response.data

    // 2️⃣ Store in persistent cache
    persistentCache[key] = data

    fs.writeFileSync(
      cacheFilePath,
      JSON.stringify(persistentCache, null, 2)
    )

    return data

  } catch (error) {
    console.error("FlavorDB error:",
      error.response?.data || error.message
    )
    throw error
  }
}

