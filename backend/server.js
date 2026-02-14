import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import morphRoute from "./routes/morph.js"
import bridgeRoute from "./routes/bridge.js"
import transliterateRoute from "./routes/transliterate.js"
dotenv.config()

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

app.use("/api/bridge", bridgeRoute)
app.use("/api/morph", morphRoute)
app.use("/api/transliterate", transliterateRoute)
app.get("/", (req, res) => {
  res.send("AromaX Backend Running")
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
