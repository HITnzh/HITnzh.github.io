<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvas = ref(null)
let ctx = null
let animId = null
let petals = []
let mouse = { x: -200, y: -200, active: false }
let scrollSpeed = 0
let lastScrollY = 0

const PETAL_COUNT = 38
const COLORS = [
  'rgba(168, 132, 198, 0.7)',  // soft violet
  'rgba(148, 112, 178, 0.6)',  // muted purple
  'rgba(188, 152, 218, 0.55)', // light lilac
  'rgba(158, 122, 188, 0.65)', // mid violet
  'rgba(178, 142, 208, 0.5)',  // pale violet
]

function createPetal() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * -window.innerHeight,
    size: 6 + Math.random() * 14,
    speed: 0.4 + Math.random() * 1.2,
    swayAmp: 20 + Math.random() * 50,
    swaySpeed: 0.003 + Math.random() * 0.008,
    swayOffset: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02,
    opacity: 0.35 + Math.random() * 0.4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    width: 0.5 + Math.random() * 0.5, // petal narrowness
  }
}

function initPetals() {
  petals = []
  for (let i = 0; i < PETAL_COUNT; i++) {
    const p = createPetal()
    p.y = Math.random() * window.innerHeight * 2 - window.innerHeight // scatter vertically
    petals.push(p)
  }
}

function drawPetal(p) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)

  // Teardrop petal shape
  const w = p.size * p.width
  const h = p.size
  ctx.beginPath()
  ctx.moveTo(0, -h * 0.8)
  ctx.bezierCurveTo(w, -h * 0.3, w, h * 0.5, 0, h)
  ctx.bezierCurveTo(-w, h * 0.5, -w, -h * 0.3, 0, -h * 0.8)
  ctx.closePath()

  ctx.fillStyle = p.color
  ctx.fill()

  // Subtle highlight
  ctx.beginPath()
  ctx.ellipse(0, -h * 0.25, w * 0.3, h * 0.15, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
  ctx.fill()

  ctx.restore()
}

function animate() {
  if (!ctx || !canvas.value) return
  const w = canvas.value.width
  const h = canvas.value.height

  ctx.clearRect(0, 0, w, h)

  for (const p of petals) {
    // Fall speed influenced by scroll
    const scrollFactor = 1 + Math.min(scrollSpeed * 0.02, 1.5)
    p.y += p.speed * scrollFactor

    // Horizontal sway
    p.swayOffset += p.swaySpeed
    p.x += Math.sin(p.swayOffset) * 0.35

    // Mouse wind — push petals away from cursor
    if (mouse.active) {
      const dx = p.x - mouse.x
      const dy = p.y - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 150) {
        const force = (1 - dist / 150) * 3
        p.x += (dx / dist) * force
        p.y += (dy / dist) * force * 0.5
        p.rotation += force * 0.03
      }
    }

    // Rotation
    p.rotation += p.rotSpeed

    // Recycle off-screen
    if (p.y > h + 60 || p.x < -80 || p.x > w + 80) {
      p.y = -60 - Math.random() * 100
      p.x = Math.random() * w
      p.swayOffset = Math.random() * Math.PI * 2
    }

    // Wrap horizontally
    if (p.x < -80) p.x = w + 60
    if (p.x > w + 80) p.x = -60

    drawPetal(p)
  }

  // Decay scroll speed
  scrollSpeed *= 0.94

  animId = requestAnimationFrame(animate)
}

function resize() {
  if (!canvas.value) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.value.width = window.innerWidth * dpr
  canvas.value.height = window.innerHeight * dpr
  canvas.value.style.width = window.innerWidth + 'px'
  canvas.value.style.height = window.innerHeight + 'px'
  if (ctx) ctx.scale(dpr, dpr)
}

function onMouseMove(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
  mouse.active = true
}

function onMouseLeave() {
  mouse.active = false
}

function onScroll() {
  const current = window.scrollY
  scrollSpeed = Math.abs(current - lastScrollY)
  lastScrollY = current
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  initPetals()
  resize()
  animId = requestAnimationFrame(animate)

  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  document.addEventListener('mouseleave', onMouseLeave)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  if (animId) cancelAnimationFrame(animId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <canvas ref="canvas" class="petal-canvas" aria-hidden="true"></canvas>
</template>
