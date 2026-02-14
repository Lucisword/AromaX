import express from "express"
import axios from "axios"

const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const { ingredientA, ingredientB } = req.body

    if (!ingredientA || !ingredientB) {
      return res.status(400).json({ error: "Both ingredients required" })
    }

    // TEMP: Fake response (we connect real API next step)
    return res.json({
      path: [ingredientA, "Garlic", ingredientB],
      similarity: "68%",
      sharedCompounds: ["Hexanal", "Methional"],
      explanation:
        "Both ingredients share volatile sulfur compounds creating umami bridge."
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
