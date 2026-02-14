import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
    {/* <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white"> */}

        {/* Ambient Glow Background */}
<div className="absolute inset-0 -z-10">
  <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-indigo-600 opacity-20 blur-[120px] rounded-full"></div>
  <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-violet-600 opacity-20 blur-[120px] rounded-full"></div>
</div>


      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-24">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          SynapseChef
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
          Flavor is not a recipe. It is a molecular network.
          Discover chemical bridges, intelligent substitutions,
          and sustainable culinary transformations.
        </p>

        <Link
          to="/app"
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition"
        >
          Launch Web App
        </Link>
      </div>

      {/* FEATURE GRID */}
      <div className="px-6 pb-32 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">
          Built on Scientific Flavor Intelligence
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <FeatureCard
            title="Molecular Pathfinding"
            description="Uses graph algorithms to compute shortest chemical connections between ingredients."
          />

          <FeatureCard
            title="Precision Substitution"
            description="Matches biochemical compound similarity instead of naive keyword swaps."
          />

          <FeatureCard
            title="Explainable AI"
            description="Provides scientific reasoning for every flavor transformation."
          />

        </div>
      </div>

    </div>
  )
}

function FeatureCard({ title, description }) {
  return (
    <div className="bg-gray-950/70 border border-gray-800 rounded-2xl p-6 backdrop-blur-lg hover:border-indigo-500 transition">
      <h3 className="text-xl font-semibold mb-4 text-indigo-400">
        {title}
      </h3>
      <p className="text-gray-400">
        {description}
      </p>
    </div>
  )
}

export default Home
