import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import WebApp from "./pages/WebApp"

function App() {
  return (
    <>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
        <Link to="/app">Web App</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<WebApp />} />
      </Routes>
    </>
  )
}

export default App
