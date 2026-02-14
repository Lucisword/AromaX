import express from "express"
import axios from "axios"
import { getSimilarEntities } from "../services/flavorService.js"

const router = express.Router()

const BASE_URL = "https://api.foodoscope.com"

// simple in-memory cache
const cache = new Map()

router.post("/", async (req, res) => {
  try {
    const { recipeTitle, constraint } = req.body

    if (!recipeTitle || !constraint) {
      return res.status(400).json({
        error: true,
        message: "recipeTitle and constraint required."
      })
    }

    // 1️⃣ Search recipe by title
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
    const recipeResponse = await axios.get(
      `${BASE_URL}/recipe2-api/search-recipe/${recipeId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FOODOSCOPE_API_KEY}`
        }
      }
    )

    const recipe = recipeResponse.data.recipe
    const ingredients = recipeResponse.data.ingredients

    // 3️⃣ Check dietary flag
    if (constraint === "vegan" && recipe.vegan === "1.0") {
      return res.json({
        error: false,
        message: "Recipe already satisfies vegan constraint.",
        originalIngredients: ingredients.map(i => i.ingredient),
        modifiedIngredients: ingredients.map(i => i.ingredient),
        substitutions: []
      })
    }

    const modifiedIngredients = []
    const substitutions = []

    // 4️⃣ Process each ingredient
    for (let item of ingredients) {
      const ingredientName = item.ingredient

      // simple non-vegan detection
      const nonVeganKeywords = ["butter", "milk", "cheese", "cream", "egg", "chicken", "beef", "fish"]

      const isNonVegan = nonVeganKeywords.some(keyword =>
        ingredientName.toLowerCase().includes(keyword)
      )

      if (constraint === "vegan" && isNonVegan) {
        // Culinary override for butter-like ingredients
        if (ingredientName.toLowerCase().includes("butter")) {
        modifiedIngredients.push("Olive Oil")

        substitutions.push({
            original: ingredientName,
            substitute: "Olive Oil",
            similarity: "Functional culinary substitution"
        })

        continue
        }


        let similarData

        if (cache.has(ingredientName.toLowerCase())) {
          similarData = cache.get(ingredientName.toLowerCase())
        } else {
          similarData = await getSimilarEntities(ingredientName)
          cache.set(ingredientName.toLowerCase(), similarData)
        }

        const candidates = similarData?.topSimilarEntities || []

        // prioritize functional fat substitutes
const functionalKeywords = ["oil", "margarine", "coconut", "plant", "vegan"]

// 1️⃣ Try functional plant-based substitute first
let plantBased = candidates.find(candidate => {
  const name = candidate.entityName.toLowerCase()

  const isPlantSafe = !nonVeganKeywords.some(keyword =>
    name.includes(keyword)
  )

  const matchesFunction = functionalKeywords.some(keyword =>
    name.includes(keyword)
  )

  return isPlantSafe && matchesFunction
})

// 2️⃣ If none found, fallback to best safe molecular match
if (!plantBased) {
  plantBased = candidates.find(candidate => {
    const name = candidate.entityName.toLowerCase()
    return !nonVeganKeywords.some(keyword =>
      name.includes(keyword)
    )
  })
}


        if (plantBased) {
          modifiedIngredients.push(plantBased.entityName)

          substitutions.push({
            original: ingredientName,
            substitute: plantBased.entityName,
            similarity: plantBased.similarMolecules
          })
        } else {
          modifiedIngredients.push(ingredientName)
        }

      } else {
        modifiedIngredients.push(ingredientName)
      }
    }

    return res.json({
      error: false,
      originalIngredients: ingredients.map(i => i.ingredient),
      modifiedIngredients,
      substitutions,
      explanation:
        `Recipe modified to satisfy ${constraint} constraint using molecular similarity substitution.`
    })

  } catch (error) {
    console.error("Morph Engine Error:",
      error.response?.data || error.message
    )

    return res.status(200).json({
      error: true,
      message: "Rate limit reached or API error. Please retry shortly."
    })
  }
})

export default router
