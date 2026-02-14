import express from "express"
import axios from "axios"
import { getSimilarEntities } from "../services/flavorService.js"

const router = express.Router()

const BASE_URL = "https://api.foodoscope.com"


// const cache = new Map()
const recipeCache = new Map()

// Simple region keyword mapping
const regionKeywords = {
  Italian: ["olive", "basil", "oregano", "parmesan", "tomato"],
  Indian: ["cumin", "turmeric", "coriander", "ghee", "garam"],
  Chinese: ["soy", "ginger", "sesame", "scallion"],
  Mexican: ["chili", "lime", "cilantro", "avocado"]
}

// Simplify ingredient name for FlavorDB lookup
const simplifyIngredient = (name) => {
  const blacklist = [
    "grain", "white", "yellow", "dried",
    "food", "coloring", "flakes"
  ]

  const words = name.toLowerCase().split(" ")

  const filtered = words.filter(word => !blacklist.includes(word))

  if (filtered.length === 0) return null

  return filtered[filtered.length - 1]
}



router.post("/", async (req, res) => {
  try {
    const { recipeTitle, targetRegion } = req.body

    if (!recipeTitle || !targetRegion) {
      return res.status(400).json({
        error: true,
        message: "recipeTitle and targetRegion required."
      })
    }

    // 1️⃣ Search recipe
    const searchResponse = await axios.get(
      `${BASE_URL}/recipe2-api/recipe-bytitle/recipeByTitle`,
      {
        params: { title: recipeTitle },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FOODOSCOPE_API_KEY}`
        }
      }
    )

    const recipeData = searchResponse.data?.data?.[0]

    if (!recipeData) {
      return res.json({
        error: true,
        message: "Recipe not found."
      })
    }

    const recipeId = recipeData.Recipe_id

    // 2️⃣ Fetch full recipe
    let recipeResponse

    if (recipeCache.has(recipeId)) {
        recipeResponse = recipeCache.get(recipeId)
        } else {
        recipeResponse = await axios.get(
            `${BASE_URL}/recipe2-api/search-recipe/${recipeId}`,
            {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.FOODOSCOPE_API_KEY}`
            }
            }
        )
        recipeCache.set(recipeId, recipeResponse)
    }


    const recipe = recipeResponse.data.recipe
    const ingredients = recipeResponse.data.ingredients

    const originalRegion = recipe.Region

    if (originalRegion === targetRegion) {
      return res.json({
        error: false,
        message: "Recipe already belongs to target region.",
        originalIngredients: ingredients.map(i => i.ingredient),
        transliteratedIngredients: ingredients.map(i => i.ingredient),
        substitutions: []
      })
    }

    const modifiedIngredients = []
    const substitutions = []

    const keywords = regionKeywords[targetRegion] || []

    for (let item of ingredients.slice(0,2)) {
        const ingredientName = item.ingredient

        const simplified = simplifyIngredient(ingredientName)

if (!simplified || simplified.length < 3) {
  modifiedIngredients.push(ingredientName)
  continue
}


        const similarData = await getSimilarEntities(simplified)



      const candidates = similarData?.topSimilarEntities || []

      // Prefer region-specific ingredients
      const regionalMatch = candidates.find(candidate => {
        const name = candidate.entityName.toLowerCase()
        return keywords.some(keyword => name.includes(keyword))
      })

      if (regionalMatch) {
        modifiedIngredients.push(regionalMatch.entityName)

        substitutions.push({
          original: ingredientName,
          substitute: regionalMatch.entityName,
          similarity: regionalMatch.similarMolecules
        })
      } else {
        modifiedIngredients.push(ingredientName)
      }
    }

    return res.json({
      error: false,
      originalRegion,
      targetRegion,
      originalIngredients: ingredients.map(i => i.ingredient),
      transliteratedIngredients: modifiedIngredients,
      substitutions,
      explanation:
        `Recipe adapted from ${originalRegion} to ${targetRegion} while preserving molecular flavor similarity.`
    })

  } catch (error) {
    console.error("Transliteration Engine Error:",
      error.response?.data || error.message
    )

    return res.status(200).json({
      error: true,
      message: "Rate limit reached or API error. Please retry shortly."
    })
  }
})

export default router
