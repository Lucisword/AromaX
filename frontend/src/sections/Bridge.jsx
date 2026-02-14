import { useEffect, useRef, useState } from "react"
import { animate } from "animejs"

function Bridge() {
  const sectionRef = useRef(null)

  const [ingredientA, setIngredientA] = useState("")
  const [ingredientB, setIngredientB] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return

    animate(sectionRef.current, {
      opacity: [0, 1],
      translateY: [80, 0],
      duration: 1200,
      easing: "easeOutExpo",
    })
  }, [])

  const handleAnalyze = async () => {
    if (!ingredientA || !ingredientB) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("http://localhost:5000/api/bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientA, ingredientB }),
      })

      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center items-center px-6 bg-gradient-to-b from-black via-neutral-950 to-black text-white"
    >
      <h2 className="text-6xl font-bold mb-6 text-center tracking-tight">
        Molecular Bridge Engine
      </h2>

      <p className="text-neutral-400 mb-12 text-center max-w-xl">
        Compute molecular compatibility between ingredients and discover
        scientifically coherent flavor transitions
      </p>

      <div className="w-full max-w-2xl space-y-6">

        <input
          type="text"
          placeholder="First Ingredient"
          value={ingredientA}
          onChange={(e) => setIngredientA(e.target.value)}
          className="w-full px-5 py-4 bg-neutral-900 border border-neutral-700 rounded-2xl focus:outline-none focus:border-yellow-400 transition"
        />

        <input
          type="text"
          placeholder="Second Ingredient"
          value={ingredientB}
          onChange={(e) => setIngredientB(e.target.value)}
          className="w-full px-5 py-4 bg-neutral-900 border border-neutral-700 rounded-2xl focus:outline-none focus:border-yellow-400 transition"
        />

        <button
          onClick={handleAnalyze}
          className="w-full py-4 bg-yellow-400 text-black font-semibold rounded-2xl hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/30 transition"
        >
          {loading ? "Analyzing..." : "Analyze Flavor Path"}
        </button>

        {result && (
  <div className="mt-12 space-y-8">

    {/* Path */}
    <div className="flex flex-wrap justify-center gap-4">
      {result.path?.map((item, index) => (
        <div
          key={index}
          className="px-6 py-3 bg-neutral-800 border border-yellow-400/30 rounded-full text-sm font-medium"
        >
          {item}
        </div>
      ))}
    </div>

    {/* Similarity */}
    <div className="flex justify-center">
      <div className="px-8 py-3 bg-yellow-400 text-black rounded-full font-bold text-lg shadow-lg">
        Similarity Score: {result.similarity}
      </div>
    </div>

    {/* Explanation */}
    <div className="p-6 bg-neutral-900 border border-yellow-400/20 rounded-3xl shadow-xl max-w-2xl mx-auto text-center text-neutral-300">
      {result.explanation}
    </div>

  </div>
)}

      </div>
    </section>
  )
}

export default Bridge
