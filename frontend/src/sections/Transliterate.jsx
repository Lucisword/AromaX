import { useEffect, useRef, useState } from "react"
import { animate } from "animejs"

function Transliterate() {
  const sectionRef = useRef(null)

  const [recipeTitle, setRecipeTitle] = useState("")
  const [targetRegion, setTargetRegion] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return

    animate(sectionRef.current, {
      opacity: [0, 1],
      translateX: [100, 0],
      duration: 1200,
      easing: "easeOutExpo",
    })
  }, [])

  const handleTransliterate = async () => {
    if (!recipeTitle || !targetRegion) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("http://localhost:5000/api/transliterate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeTitle, targetRegion }),
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
      className="min-h-screen flex flex-col justify-center items-center px-6 bg-gradient-to-b from-black via-blue-950 to-black text-white"
    >
      <h2 className="text-6xl font-bold mb-6 text-center">
        Transliteration Engine
      </h2>

      <p className="text-blue-400 mb-12 text-center max-w-xl">
        Adapt recipes across cultures while preserving molecular identity.
      </p>

      <div className="w-full max-w-2xl space-y-6">

        <input
          type="text"
          placeholder="Recipe Title"
          value={recipeTitle}
          onChange={(e) => setRecipeTitle(e.target.value)}
          className="w-full px-5 py-4 bg-neutral-900 border border-blue-700 rounded-2xl focus:outline-none focus:border-blue-400 transition"
        />

        <input
          type="text"
          placeholder="Target Region (e.g. Italian)"
          value={targetRegion}
          onChange={(e) => setTargetRegion(e.target.value)}
          className="w-full px-5 py-4 bg-neutral-900 border border-blue-700 rounded-2xl focus:outline-none focus:border-blue-400 transition"
        />

        <button
          onClick={handleTransliterate}
          className="w-full py-4 bg-blue-500 text-black font-semibold rounded-2xl hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 transition"
        >
          {loading ? "Adapting..." : "Adapt Cuisine"}
        </button>

        {result && (
  <div className="mt-12 space-y-10">

    <div className="text-center text-blue-400 font-bold text-lg">
      {result.originalRegion} → {result.targetRegion}
    </div>

    <div className="p-6 bg-neutral-900 border border-blue-400/20 rounded-3xl">
      <h3 className="text-blue-400 font-bold mb-4">
        Ingredient Adaptation
      </h3>

      {result.substitutions?.length > 0 ? (
        result.substitutions.map((sub, i) => (
          <div key={i} className="flex justify-between text-sm mb-2">
            <span>{sub.original}</span>
            <span className="text-blue-400">
              → {sub.substitute}
            </span>
          </div>
        ))
      ) : (
        <p className="text-neutral-400">
          No regional substitution required.
        </p>
      )}
    </div>

    <div className="text-center text-neutral-300">
      {result.explanation}
    </div>

  </div>
)}


      </div>
    </section>
  )
}

export default Transliterate
