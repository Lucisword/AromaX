import { useEffect, useRef } from "react"
import { animate } from "animejs"
import FloatingParticles from "../components/FloatingParticles"

function Hero() {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)

  useEffect(() => {
    animate(titleRef.current, {
      translateY: [60, 0],
      opacity: [0, 1],
      duration: 1400,
      easing: "easeOutExpo"
    })

    animate(subtitleRef.current, {
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 1600,
      delay: 300,
      easing: "easeOutExpo"
    })
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden"
    >
      {/* Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10 blur-3xl"></div>

      <FloatingParticles />

      <div className="text-center px-6 relative z-10">
        <h1
          ref={titleRef}
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 opacity-0 leading-tight"
        >
          Molecular Flavor <span className="text-yellow-400">Intelligence</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl text-gray-400 max-w-2xl mx-auto opacity-0"
        >
          Discover chemical bridges, intelligent substitutions, and cuisine transliteration powered by FlavorDB & RecipeDB.
        </p>

        <div className="mt-10">
          <button
  onClick={() =>
    document
      .getElementById("engine")
      .scrollIntoView({ behavior: "smooth" })
  }
  className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-full hover:scale-105 transition duration-300"
>
  Start Exploring
</button>

        </div>
      </div>
    </section>
  )
}

export default Hero
