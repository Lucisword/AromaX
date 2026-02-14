import { useEffect, useRef, useState } from "react"
import { animate } from "animejs"

function Morph() {
  const sectionRef = useRef(null)

  const [recipeTitle, setRecipeTitle] = useState("")
  const [constraint, setConstraint] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return

    animate(sectionRef.current, {
      opacity: [0, 1],
      translateX: [-100, 0],
      duration: 1200,
      easing: "easeOutExpo",
    })
  }, [])

  const handleMorph = async () => {
    if (!recipeTitle || !constraint) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("http://localhost:5000/api/morph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeTitle, constraint }),
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
      className="min-h-screen flex flex-col justify-center items-center px-6 bg-gradient-to-b from-black via-emerald-950 to-black text-white"
    >
      <h2 className="text-6xl font-bold mb-6 text-center">
        Morph Engine
      </h2>

      <p className="text-emerald-400 mb-12 text-center max-w-xl">
        Constraint-aware molecular substitution preserving flavor identities.
      </p>

      <div className="w-full max-w-2xl space-y-6">

        <input
          type="text"
          placeholder="Recipe Title"
          value={recipeTitle}
          onChange={(e) => setRecipeTitle(e.target.value)}
          className="w-full px-5 py-4 bg-neutral-900 border border-emerald-700 rounded-2xl focus:outline-none focus:border-emerald-400 transition"
        />

        <input
          type="text"
          placeholder="Constraint (e.g. vegan)"
          value={constraint}
          onChange={(e) => setConstraint(e.target.value)}
          className="w-full px-5 py-4 bg-neutral-900 border border-emerald-700 rounded-2xl focus:outline-none focus:border-emerald-400 transition"
        />

        <button
          onClick={handleMorph}
          className="w-full py-4 bg-emerald-500 text-black font-semibold rounded-2xl hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/30 transition"
        >
          {loading ? "Re-engineering..." : "Rebuild Recipe"}
        </button>

        {result && (
  <div className="mt-12 space-y-10">

    {/* Original Ingredients */}
    <div className="p-6 bg-neutral-900 border border-emerald-400/20 rounded-3xl">
      <h3 className="text-emerald-400 font-bold mb-4">
        Original Ingredients
      </h3>
      <ul className="space-y-1 text-neutral-300 text-sm">
        {result.originalIngredients?.map((ing, i) => (
          <li key={i}>• {ing}</li>
        ))}
      </ul>
    </div>

    {/* Modified Ingredients */}
    <div className="p-6 bg-neutral-900 border border-emerald-400/20 rounded-3xl">
      <h3 className="text-emerald-400 font-bold mb-4">
        Modified Ingredients
      </h3>
      <ul className="space-y-1 text-neutral-300 text-sm">
        {result.modifiedIngredients?.map((ing, i) => (
          <li key={i}>• {ing}</li>
        ))}
      </ul>
    </div>

    {/* Substitutions */}
    {result.substitutions?.length > 0 && (
      <div className="p-6 bg-neutral-900 border border-emerald-400/20 rounded-3xl">
        <h3 className="text-emerald-400 font-bold mb-4">
          Substitutions
        </h3>
        {result.substitutions.map((sub, i) => (
          <div key={i} className="flex justify-between text-sm mb-2">
            <span>{sub.original}</span>
            <span className="text-emerald-400">
              → {sub.substitute}
            </span>
          </div>
        ))}
      </div>
    )}

    <div className="text-center text-neutral-300">
      {result.explanation}
    </div>

  </div>
)}


      </div>
    </section>
  )
}

export default Morph
