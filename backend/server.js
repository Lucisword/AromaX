import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import bridgeRoute from "./routes/bridge.js"

dotenv.config()

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

app.use("/api/bridge", bridgeRoute)

app.get("/", (req, res) => {
  res.send("AromaX Backend Running")
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
