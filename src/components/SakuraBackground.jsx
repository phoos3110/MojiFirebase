import { useEffect, useRef } from 'react'

const SAKURA = ['🌸', '🌺', '⭐', '✨', '💫', '🌸', '🌸']

export default function SakuraBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let id = 0
    const particles = []

    const spawn = () => {
      const el = document.createElement('div')
      el.className = 'sakura-particle'
      el.textContent = SAKURA[Math.floor(Math.random() * SAKURA.length)]
      el.style.left = `${Math.random() * 100}vw`
      el.style.fontSize = `${10 + Math.random() * 14}px`
      const dur = 8 + Math.random() * 10
      el.style.animationDuration = `${dur}s`
      el.style.animationDelay = `${Math.random() * 3}s`
      el.style.opacity = '0'
      container.appendChild(el)
      particles.push(el)

      setTimeout(() => {
        if (container.contains(el)) container.removeChild(el)
        const idx = particles.indexOf(el)
        if (idx > -1) particles.splice(idx, 1)
      }, (dur + 3) * 1000)
    }

    // Spawn initial batch
    for (let i = 0; i < 12; i++) {
      setTimeout(() => spawn(), i * 500)
    }

    // Keep spawning
    const interval = setInterval(spawn, 1500)
    id = interval

    return () => {
      clearInterval(id)
      particles.forEach(el => {
        if (container.contains(el)) container.removeChild(el)
      })
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  )
}
