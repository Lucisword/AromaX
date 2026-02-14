import Navigation from "./components/Navigation"
import Hero from "./sections/Hero"
import Bridge from "./sections/Bridge"
import Morph from "./sections/Morph"
import Transliterate from "./sections/Transliterate"

function App() {
  return (
    <div className="bg-black text-white overflow-x-hidden">
      <Navigation />
      <Hero />
      
      <Bridge />
      <Morph />
      <Transliterate />
    </div>
  )
}

export default App
