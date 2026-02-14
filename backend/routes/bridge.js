import express from "express"
import { getSimilarEntities } from "../services/flavorService.js"

const router = express.Router()

// Simple in-memory cache (prevents rate limit explosion)
const cache = new Map()

router.post("/", async (req, res) => {
  try {
    const { ingredientA, ingredientB } = req.body

    if (!ingredientA || !ingredientB) {
      return res.status(400).json({
        error: true,
        message: "Both ingredients are required."
      })
    }

    const keyA = ingredientA.toLowerCase()
    const keyB = ingredientB.toLowerCase()
    if (keyA === keyB) {
  return res.json({
    error: false,
    path: [ingredientA],
    similarity: 100,
    explanation: "Both ingredients are identical."
  })
}


    let dataA
    let dataB

    // 🔥 Cache lookup
    if (cache.has(keyA)) {
      dataA = cache.get(keyA)
    } else {
      dataA = await getSimilarEntities(ingredientA)
      cache.set(keyA, dataA)
    }

    if (cache.has(keyB)) {
      dataB = cache.get(keyB)
    } else {
      dataB = await getSimilarEntities(ingredientB)
      cache.set(keyB, dataB)
    }
    

    const listA = dataA?.topSimilarEntities || []
    const listB = dataB?.topSimilarEntities || []

    // 1️⃣ Direct similarity check
    const directMatch = listA.find(
      item =>
        item.entityName.toLowerCase() === keyB
    )

    if (directMatch) {
      return res.json({
        error: false,
        path: [ingredientA, ingredientB],
        similarity: directMatch.similarMolecules,
        explanation: "Direct molecular similarity found between ingredients."
      })
    }

    // 2️⃣ Intermediate bridge search
    for (let itemA of listA) {
      const intermediate = listB.find(
        itemB =>
          itemB.entityName.toLowerCase() ===
          itemA.entityName.toLowerCase()
      )

      if (intermediate) {
        return res.json({
          error: false,
          path: [ingredientA, itemA.entityName, ingredientB],
          similarity: intermediate.similarMolecules,
          explanation:
            "Intermediate ingredient found via shared molecular similarity."
        })
      }
    }

    // 3️⃣ No bridge found
    return res.json({
      error: false,
      path: [ingredientA, ingredientB],
      similarity: 0,
      explanation:
        "No strong molecular bridge found within top similarity network."
    })

  } catch (error) {

    // 🚨 Rate limit safe handling
    console.error("Bridge Engine Error:",
      error.response?.data || error.message
    )

    return res.status(200).json({
      error: true,
      path: [],
      similarity: 0,
      explanation:
        "FlavorDB API rate limit reached. Please wait a moment and retry."
    })
  }
})

export default router
