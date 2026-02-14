function Navigation() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <h1 className="text-2xl font-bold tracking-wide">
          Aroma<span className="text-yellow-400">X</span>
        </h1>

        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest">
          <a href="#hero" className="hover:text-yellow-400 transition">
            Home
          </a>
          <a href="#features" className="hover:text-yellow-400 transition">
            Features
          </a>
          <a href="#experience" className="hover:text-yellow-400 transition">
            Experience
          </a>
        </div>

      </div>
    </nav>
  )
}

export default Navigation
