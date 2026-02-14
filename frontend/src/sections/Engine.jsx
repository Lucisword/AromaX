import { useState } from "react"

function Engine() {
  const [ingredientA, setIngredientA] = useState("")
  const [ingredientB, setIngredientB] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleAnalyze = async () => {
    if (!ingredientA || !ingredientB) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("http://localhost:5000/api/bridge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ingredientA, ingredientB })
      })

      const data = await response.json()
      setResult(data)

    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  return (
    <section
      id="engine"
      className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-6"
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center">
        Molecular Bridge Engine
      </h2>

      <div className="w-full max-w-2xl space-y-6">

        <input
          type="text"
          placeholder="First Ingredient"
          value={ingredientA}
          onChange={(e) => setIngredientA(e.target.value)}
          className="w-full px-5 py-4 bg-black border border-white/10 rounded-xl focus:outline-none focus:border-yellow-400 transition"
        />

        <input
          type="text"
          placeholder="Second Ingredient"
          value={ingredientB}
          onChange={(e) => setIngredientB(e.target.value)}
          className="w-full px-5 py-4 bg-black border border-white/10 rounded-xl focus:outline-none focus:border-yellow-400 transition"
        />

        <button
          onClick={handleAnalyze}
          className="w-full py-4 bg-yellow-400 text-black font-semibold rounded-xl hover:scale-[1.02] transition"
        >
          {loading ? "Analyzing..." : "Analyze Flavor Path"}
        </button>

        {result && (
  <div className="mt-8 p-6 bg-black border border-yellow-400/20 rounded-xl space-y-4">

    {result.error ? (
      <p className="text-red-400">
        {result.explanation}
      </p>
    ) : (
      <>
        <p>
          <strong>Shortest Path:</strong>{" "}
          {Array.isArray(result.path) && result.path.length > 0
            ? result.path.join(" → ")
            : "No path found"}
        </p>

        <p>
          <strong>Similarity:</strong>{" "}
          {result.similarity ?? "N/A"}
        </p>

        <p>
          <strong>Explanation:</strong>{" "}
          {result.explanation || "No explanation available."}
        </p>
      </>
    )}

  </div>
)}


      </div>
    </section>
  )

}

export default Engine
