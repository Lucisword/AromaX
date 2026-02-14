import { useState } from "react"

function WebApp() {
  const [mode, setMode] = useState("path")
  const [ingredient1, setIngredient1] = useState("")
  const [ingredient2, setIngredient2] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    setLoading(true)
    setResult(null)

    setTimeout(() => {
      setLoading(false)

      if (mode === "path") {
        setResult({
          title: "Molecular Bridge Found",
          content: "Hexanal → Limonene → Ethyl Butyrate",
          explanation:
            "Both ingredients share volatile compounds that create complementary citrus-earthy balance."
        })
      }

      if (mode === "substitution") {
        setResult({
          title: "Optimal Substitution",
          content: "Nutritional Yeast",
          explanation:
            "High glutamic acid presence mimics umami density similar to aged cheese."
        })
      }

      if (mode === "inventory") {
        setResult({
          title: "Flavor-Compatible Dish",
          content: "Savory Citrus Mushroom Reduction",
          explanation:
            "Shared aldehydes and terpenes create harmonic depth when combined."
        })
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-2xl bg-gray-950/70 backdrop-blur-lg border border-gray-800 rounded-2xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          SynapseChef
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Flavor is a molecular network.
        </p>

        {/* Tabs */}
        <div className="flex mb-8 bg-gray-900 rounded-xl p-1">
          <Tab label="Molecular Path" active={mode === "path"} onClick={() => setMode("path")} />
          <Tab label="Substitution" active={mode === "substitution"} onClick={() => setMode("substitution")} />
          <Tab label="Inventory Mode" active={mode === "inventory"} onClick={() => setMode("inventory")} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {mode !== "inventory" && (
            <input
              type="text"
              value={ingredient1}
              onChange={(e) => setIngredient1(e.target.value)}
              placeholder="Enter Ingredient"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          {mode === "path" && (
            <input
              type="text"
              value={ingredient2}
              onChange={(e) => setIngredient2(e.target.value)}
              placeholder="Second Ingredient"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          {mode === "inventory" && (
            <textarea
              placeholder="Enter leftover ingredients separated by commas"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-semibold"
          >
            Analyze
          </button>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 text-center text-indigo-400 animate-pulse">
            Analyzing molecular network...
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className="mt-8 p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
            <h3 className="text-xl font-semibold text-indigo-400">
              {result.title}
            </h3>

            <p className="text-lg font-medium">
              {result.content}
            </p>

            <div className="border-t border-gray-800 pt-4">
              <p className="text-sm text-gray-400">
                {result.explanation}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-indigo-600 text-white"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  )
}

export default WebApp
