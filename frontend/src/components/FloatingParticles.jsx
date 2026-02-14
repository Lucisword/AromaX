import { useEffect, useRef } from "react"
import { animate } from "animejs"

function FloatingParticles() {
  const containerRef = useRef(null)

  useEffect(() => {
    const particles = containerRef.current.querySelectorAll(".particle")

    particles.forEach((p, i) => {
      animate(p, {
        translateY: [0, -20],
        direction: "alternate",
        loop: true,
        duration: 3000 + i * 500,
        easing: "easeInOutSine"
      })
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="particle absolute w-2 h-2 bg-yellow-400 rounded-full opacity-40"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  )
}

export default FloatingParticles
