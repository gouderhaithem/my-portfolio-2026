'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

export default function PortfolioInit() {
  const initialized = useRef(false)
  const t = useTranslations('contactForm')
  // The init effect runs once on mount; keep the latest t reachable from its
  // closures without re-running the whole setup.
  const tRef = useRef(t)
  tRef.current = t

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    let rafLoopId: number
    let cursorRafId: number
    let intervalSafetyId: ReturnType<typeof setInterval>
    let cursorIntervalId: ReturnType<typeof setInterval>

    // These are set inside init() and used in cleanup
    let cleanupRenderer: { dispose: () => void } | null = null
    let cleanupLenis: { destroy: () => void } | null = null
    let cleanupScrollTrigger: { killAll: () => void } | null = null
    let cleanupGeometries: Array<{ dispose: () => void }> = []
    let cleanupMaterials: Array<{ dispose: () => void }> = []
    const cleanupListeners: Array<() => void> = []

    // ---------- helpers (used by both sync and async paths) ----------
    const $ = (s: string, r: Document | Element = document) =>
      r.querySelector(s) as HTMLElement | null
    const $$ = (s: string, r: Document | Element = document) =>
      [...r.querySelectorAll(s)] as HTMLElement[]

    // ============================================================
    // SYNC INIT — runs immediately, no heavy imports needed
    // ============================================================

    // Mobile nav burger
    const burger = document.getElementById('burger')
    const navList = document.getElementById('nav-list')
    if (burger && navList) {
      const burgerClick = () => {
        const on = burger.classList.toggle('on')
        navList.classList.toggle('on', on)
      }
      burger.addEventListener('click', burgerClick)
      cleanupListeners.push(() => burger.removeEventListener('click', burgerClick))
      navList.querySelectorAll('a').forEach((a) => {
        const close = () => {
          burger.classList.remove('on')
          navList.classList.remove('on')
        }
        a.addEventListener('click', close)
        cleanupListeners.push(() => a.removeEventListener('click', close))
      })
    }

    // Custom dropdowns
    ;(function initDropdowns() {
      const dds = $$('.dd')
      dds.forEach((dd) => {
        const trigger = dd.querySelector('.dd-trigger') as HTMLButtonElement
        const value = dd.querySelector('.dd-value') as HTMLElement
        const menu = dd.querySelector('.dd-menu') as HTMLElement
        if (!trigger || !value || !menu) return
        const items = [...menu.querySelectorAll('li')] as HTMLElement[]
        dd.classList.add('empty')
        ;(dd as HTMLElement).dataset.value = ''

        function close() {
          dd.classList.remove('on')
          trigger.setAttribute('aria-expanded', 'false')
          items.forEach((it) => it.classList.remove('kbd-focus'))
        }
        function open() {
          dds.forEach((d) => { if (d !== dd) d.classList.remove('on') })
          dd.classList.add('on')
          trigger.setAttribute('aria-expanded', 'true')
        }
        function pick(it: HTMLElement) {
          items.forEach((o) => o.classList.remove('selected'))
          it.classList.add('selected')
          const lastSpan = it.querySelector('span:last-child')
          if (lastSpan) value.textContent = lastSpan.textContent
          ;(dd as HTMLElement).dataset.value = it.dataset.val ?? ''
          dd.classList.remove('empty')
          close()
          dd.dispatchEvent(new CustomEvent('dd-change', { detail: { value: it.dataset.val } }))
        }

        const triggerClick = (e: Event) => {
          e.stopPropagation()
          if (dd.classList.contains('on')) close()
          else open()
        }
        trigger.addEventListener('click', triggerClick)
        cleanupListeners.push(() => trigger.removeEventListener('click', triggerClick))

        items.forEach((it) => {
          const itemClick = (e: Event) => { e.stopPropagation(); pick(it) }
          it.addEventListener('click', itemClick)
          cleanupListeners.push(() => it.removeEventListener('click', itemClick))
        })

        const triggerKeydown = (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault()
            open()
            const first = items.find((i) => i.classList.contains('selected')) || items[0]
            items.forEach((i) => i.classList.remove('kbd-focus'))
            if (first) first.classList.add('kbd-focus')
          } else if (e.key === 'Escape') {
            close()
          }
        }
        trigger.addEventListener('keydown', triggerKeydown)
        cleanupListeners.push(() => trigger.removeEventListener('keydown', triggerKeydown))

        const menuKeydown = (e: KeyboardEvent) => {
          const cur = items.findIndex((i) => i.classList.contains('kbd-focus'))
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            items.forEach((i) => i.classList.remove('kbd-focus'))
            items[(cur + 1) % items.length].classList.add('kbd-focus')
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            items.forEach((i) => i.classList.remove('kbd-focus'))
            items[(cur - 1 + items.length) % items.length].classList.add('kbd-focus')
          } else if (e.key === 'Enter') {
            e.preventDefault()
            const focused = items.find((i) => i.classList.contains('kbd-focus'))
            if (focused) pick(focused)
          } else if (e.key === 'Escape') {
            close()
            trigger.focus()
          }
        }
        menu.addEventListener('keydown', menuKeydown)
        cleanupListeners.push(() => menu.removeEventListener('keydown', menuKeydown))
      })

      const clickOut = () => dds.forEach((d) => d.classList.remove('on'))
      document.addEventListener('click', clickOut)
      cleanupListeners.push(() => document.removeEventListener('click', clickOut))
    })()

    // Contact form
    // Toast helper
    function showToast(title: string, sub: string, isError = false) {
      const existing = document.getElementById('portfolio-toast')
      if (existing) existing.remove()

      const toast = document.createElement('div')
      toast.id = 'portfolio-toast'
      toast.className = 'toast'
      if (isError) toast.style.borderLeftColor = '#ff8b6b'
      toast.innerHTML = `
        <div class="toast-icon">${isError ? '✕' : '✓'}</div>
        <div class="toast-body">
          <span class="toast-title">${title}</span>
          <span class="toast-sub">${sub}</span>
        </div>`
      document.body.appendChild(toast)

      const dismiss = () => {
        toast.classList.add('hide')
        setTimeout(() => toast.remove(), 450)
      }
      const timer = setTimeout(dismiss, 4500)
      toast.addEventListener('click', () => { clearTimeout(timer); dismiss() })
    }

    ;(function initForm() {
      const form = document.getElementById('contact-form') as HTMLFormElement | null
      const formStatus = document.getElementById('f-status')
      if (!form || !formStatus) return

      const submitHandler = (e: Event) => {
        e.preventDefault()
        formStatus.classList.remove('err')
        formStatus.textContent = ''
        const nameEl = form.querySelector('#f-name') as HTMLInputElement
        const emailEl = form.querySelector('#f-email') as HTMLInputElement
        const typeEl = document.getElementById('f-type') as HTMLElement
        const budgetEl = document.getElementById('f-budget') as HTMLElement
        const msgEl = form.querySelector('#f-msg') as HTMLTextAreaElement
        const name = nameEl?.value.trim() ?? ''
        const email = emailEl?.value.trim() ?? ''
        const type = typeEl?.dataset.value ?? ''
        const budget = budgetEl?.dataset.value ?? ''
        const msg = msgEl?.value.trim() ?? ''
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        if (!name || !emailOk || !type || !msg) {
          formStatus.classList.add('err')
          formStatus.textContent = !emailOk ? tRef.current('errorEmail') : tRef.current('errorFields')
          return
        }
        const btn = form.querySelector('.send-btn') as HTMLButtonElement
        const orig = btn.innerHTML
        btn.disabled = true
        btn.innerHTML = `<span>${tRef.current('sending')}</span>`
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, type, budget, message: msg }),
        })
          .then((res) => res.json())
          .then(() => {
            btn.innerHTML = `<span>${tRef.current('sent')}</span><span class="arr">✓</span>`
            form.reset()
            $$('.dd').forEach((dd) => {
              dd.classList.add('empty')
              ;(dd as HTMLElement).dataset.value = ''
              const v = dd.querySelector('.dd-value') as HTMLElement
              if (v) v.textContent = (v as HTMLElement).dataset.placeholder ?? ''
              dd.querySelectorAll('li').forEach((o) => o.classList.remove('selected'))
            })
            showToast(tRef.current('toastSentTitle'), tRef.current('toastSentSub'))
            setTimeout(() => {
              btn.disabled = false
              btn.innerHTML = orig
            }, 4000)
          })
          .catch(() => {
            showToast(tRef.current('toastErrorTitle'), tRef.current('toastErrorSub'), true)
            btn.disabled = false
            btn.innerHTML = orig
          })
      }

      form.addEventListener('submit', submitHandler)
      cleanupListeners.push(() => form.removeEventListener('submit', submitHandler))
    })()

    // ============================================================
    // ASYNC INIT — Three.js / GSAP / Lenis (loads in background)
    // ============================================================

    async function init() {
      const THREE = await import('three')
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const LenisModule = await import('lenis')
      const Lenis = LenisModule.default

      gsap.registerPlugin(ScrollTrigger)
      cleanupScrollTrigger = ScrollTrigger
      const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t
      const smoothstep = (a: number, b: number, x: number) => {
        const t = clamp((x - a) / (b - a), 0, 1)
        return t * t * (3 - 2 * t)
      }

      // ---------- state (mutated by tweaks) ----------
      const state = {
        accent: 0x7c5cff,
        shape: 'icosahedron',
        motion: 1,
        particles: 3200,
        paused: false,
      }

      // ---------- Lenis smooth scroll ----------
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
      } as any)
      cleanupLenis = lenis

      lenis.on('scroll', ScrollTrigger.update)

      $$('a[data-link]').forEach((a) => {
        const handler = (e: Event) => {
          const href = (a as HTMLAnchorElement).getAttribute('href')
          if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault()
            const t = document.querySelector(href)
            if (t) lenis.scrollTo(t as HTMLElement, { offset: 0, duration: 1.4 })
          }
        }
        a.addEventListener('click', handler)
        cleanupListeners.push(() => a.removeEventListener('click', handler))
      })

      // ---------- Three.js setup ----------
      const canvas = document.getElementById('scene') as HTMLCanvasElement
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
      })
      cleanupRenderer = renderer
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(window.innerWidth, window.innerHeight, false)
      renderer.setClearColor(0x000000, 0)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      renderer.outputColorSpace = THREE.SRGBColorSpace

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        32,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      )
      camera.position.set(0, 0, 7)

      // Procedural environment map for refractions / reflections.
      function buildEnvTexture() {
        const c = document.createElement('canvas')
        c.width = 1024
        c.height = 512
        const g = c.getContext('2d')!
        const grad = g.createLinearGradient(0, 0, 0, 512)
        grad.addColorStop(0.0, '#1a1430')
        grad.addColorStop(0.35, '#4a3aa0')
        grad.addColorStop(0.55, '#8a5cff')
        grad.addColorStop(0.75, '#1a1438')
        grad.addColorStop(1.0, '#05050c')
        g.fillStyle = grad
        g.fillRect(0, 0, 1024, 512)
        function blob(x: number, y: number, r: number, col: string) {
          const rg = g.createRadialGradient(x, y, 0, x, y, r)
          rg.addColorStop(0, col)
          rg.addColorStop(1, 'rgba(0,0,0,0)')
          g.fillStyle = rg
          g.fillRect(0, 0, 1024, 512)
        }
        blob(180, 180, 260, 'rgba(255,255,255,1.0)')
        blob(820, 140, 240, 'rgba(200,160,255,1.0)')
        blob(520, 360, 320, 'rgba(255,240,220,0.65)')
        blob(680, 70, 180, 'rgba(255,210,190,0.85)')
        blob(340, 80, 140, 'rgba(140,200,255,0.75)')

        const tex = new THREE.CanvasTexture(c)
        tex.mapping = THREE.EquirectangularReflectionMapping
        tex.colorSpace = THREE.SRGBColorSpace

        const pmrem = new THREE.PMREMGenerator(renderer)
        pmrem.compileEquirectangularShader()
        const env = pmrem.fromEquirectangular(tex).texture
        pmrem.dispose()
        tex.dispose()
        return env
      }
      scene.environment = buildEnvTexture()

      // Stage holds everything; we tilt it for parallax.
      const stage = new THREE.Group()
      scene.add(stage)

      // Lights
      const key = new THREE.PointLight(0xffffff, 80, 30, 1.6)
      key.position.set(3, 4, 6)
      stage.add(key)
      const rim = new THREE.PointLight(state.accent, 110, 30, 1.6)
      rim.position.set(-4, -2, -4)
      stage.add(rim)
      const fill = new THREE.PointLight(0x88aaff, 35, 30, 1.6)
      fill.position.set(-3, 4, 4)
      stage.add(fill)
      const heroSpot = new THREE.SpotLight(0xffffff, 12, 12, Math.PI / 6, 0.4, 1.2)
      heroSpot.position.set(0, 4, 3)
      heroSpot.target.position.set(0, 0, 0)
      stage.add(heroSpot, heroSpot.target)
      stage.add(new THREE.AmbientLight(0xffffff, 0.12))

      // ============================================================
      // AMBIENT BACKDROP
      // ============================================================
      const ambientGroup = new THREE.Group()
      scene.add(ambientGroup)

      const bgRingMat = new THREE.LineBasicMaterial({
        color: 0x7c5cff,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const bgRing1Geo = new THREE.WireframeGeometry(new THREE.TorusGeometry(11, 0.04, 12, 220))
      cleanupGeometries.push(bgRing1Geo)
      const bgRing1 = new THREE.LineSegments(bgRing1Geo, bgRingMat)
      bgRing1.rotation.x = Math.PI / 2.4
      bgRing1.position.z = -10
      ambientGroup.add(bgRing1)

      const bgRing2Mat = bgRingMat.clone()
      bgRing2Mat.color.setHex(0x4ade80)
      bgRing2Mat.opacity = 0.12
      cleanupMaterials.push(bgRing2Mat)
      const bgRing2Geo = new THREE.WireframeGeometry(new THREE.TorusGeometry(8, 0.03, 12, 180))
      cleanupGeometries.push(bgRing2Geo)
      const bgRing2 = new THREE.LineSegments(bgRing2Geo, bgRing2Mat)
      bgRing2.rotation.x = Math.PI / 3.2
      bgRing2.rotation.y = Math.PI / 6
      bgRing2.position.z = -9
      ambientGroup.add(bgRing2)

      const bgIcoMat = new THREE.LineBasicMaterial({
        color: 0xa78cff,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const bgIcoGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(6.5, 1))
      cleanupGeometries.push(bgIcoGeo)
      const bgIco = new THREE.LineSegments(bgIcoGeo, bgIcoMat)
      bgIco.position.z = -8
      ambientGroup.add(bgIco)

      // distant star points
      function makeStarTexture(soft = 0.5) {
        const c = document.createElement('canvas')
        c.width = c.height = 64
        const g = c.getContext('2d')!
        const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32)
        rg.addColorStop(0, `rgba(255,255,255,1)`)
        rg.addColorStop(soft, `rgba(255,255,255,0.4)`)
        rg.addColorStop(1, `rgba(255,255,255,0)`)
        g.fillStyle = rg
        g.fillRect(0, 0, 64, 64)
        return new THREE.CanvasTexture(c)
      }

      const STAR_COUNT = 1400
      const starGeo = new THREE.BufferGeometry()
      const starPos = new Float32Array(STAR_COUNT * 3)
      const starAux = new Float32Array(STAR_COUNT)
      for (let i = 0; i < STAR_COUNT; i++) {
        const r = 14 + Math.random() * 16
        const a = Math.random() * Math.PI * 2
        const z = (Math.random() * 2 - 1) * 0.85
        const rr = Math.sqrt(1 - z * z)
        starPos[i * 3 + 0] = r * rr * Math.cos(a)
        starPos[i * 3 + 1] = r * rr * Math.sin(a)
        starPos[i * 3 + 2] = r * z * 0.5 - 6
        starAux[i] = Math.random() * Math.PI * 2
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
      const starMat = new THREE.PointsMaterial({
        size: 3.0,
        map: makeStarTexture(0.35),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xffffff,
        opacity: 1.0,
        sizeAttenuation: false,
      })
      const stars = new THREE.Points(starGeo, starMat)
      ambientGroup.add(stars)

      const NEAR_STAR_COUNT = 400
      const nearStarGeo = new THREE.BufferGeometry()
      const nearStarPos = new Float32Array(NEAR_STAR_COUNT * 3)
      for (let i = 0; i < NEAR_STAR_COUNT; i++) {
        nearStarPos[i * 3 + 0] = (Math.random() - 0.5) * 24
        nearStarPos[i * 3 + 1] = (Math.random() - 0.5) * 14
        nearStarPos[i * 3 + 2] = -4 - Math.random() * 6
      }
      nearStarGeo.setAttribute('position', new THREE.BufferAttribute(nearStarPos, 3))
      const nearStarMat = new THREE.PointsMaterial({
        size: 5.0,
        map: makeStarTexture(0.4),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xc6b8ff,
        opacity: 0.9,
        sizeAttenuation: false,
      })
      const nearStars = new THREE.Points(nearStarGeo, nearStarMat)
      ambientGroup.add(nearStars)

      // Drifting nebula sprites
      function makeNebulaTexture(hex: string) {
        const c = document.createElement('canvas')
        c.width = c.height = 256
        const g = c.getContext('2d')!
        const rg = g.createRadialGradient(128, 128, 0, 128, 128, 128)
        rg.addColorStop(0, hex + 'cc')
        rg.addColorStop(0.45, hex + '33')
        rg.addColorStop(1, hex + '00')
        g.fillStyle = rg
        g.fillRect(0, 0, 256, 256)
        return new THREE.CanvasTexture(c)
      }
      const nebulae: THREE.Sprite[] = []
      const nebCfg = [
        { col: '#7c5cff', x: 6, y: 2, z: -8, s: 14 },
        { col: '#3a7dff', x: -7, y: -3, z: -9, s: 16 },
        { col: '#ff6b9d', x: 2, y: 5, z: -11, s: 12 },
        { col: '#4ade80', x: -3, y: -5, z: -10, s: 11 },
        { col: '#a78cff', x: 9, y: -6, z: -7, s: 10 },
        { col: '#ffaa6b', x: -9, y: 6, z: -12, s: 9 },
      ]
      nebCfg.forEach((n) => {
        const mat = new THREE.SpriteMaterial({
          map: makeNebulaTexture(n.col),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.85,
        })
        const sp = new THREE.Sprite(mat)
        sp.position.set(n.x, n.y, n.z)
        sp.scale.setScalar(n.s)
        sp.userData = { ...n, phase: Math.random() * Math.PI * 2 }
        ambientGroup.add(sp)
        nebulae.push(sp)
      })

      // floating dust
      const DUST_COUNT = 220
      const dustGeo = new THREE.BufferGeometry()
      const dustPos = new Float32Array(DUST_COUNT * 3)
      const dustVel = new Float32Array(DUST_COUNT * 3)
      for (let i = 0; i < DUST_COUNT; i++) {
        dustPos[i * 3] = (Math.random() - 0.5) * 16
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 10
        dustPos[i * 3 + 2] = -2 - Math.random() * 6
        dustVel[i * 3] = (Math.random() - 0.5) * 0.03
        dustVel[i * 3 + 1] = Math.random() * 0.03 + 0.005
        dustVel[i * 3 + 2] = (Math.random() - 0.5) * 0.01
      }
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
      const dustMat = new THREE.PointsMaterial({
        size: 0.06,
        map: makeStarTexture(0.5),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xffffff,
        opacity: 0.85,
      })
      const dust = new THREE.Points(dustGeo, dustMat)
      ambientGroup.add(dust)

      // ============================================================
      // SCENE GROUPS
      // ============================================================
      const groups: Record<string, THREE.Group> = {}

      // ----- HERO: glassy gem -----
      const HERO_SHAPES: Record<string, () => THREE.BufferGeometry> = {
        icosahedron: () => new THREE.IcosahedronGeometry(1.0, 1),
        torus: () => new THREE.TorusKnotGeometry(0.7, 0.24, 220, 32, 2, 3),
        dodecahedron: () => new THREE.DodecahedronGeometry(1.05, 0),
      }
      const heroMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.04,
        transmission: 0.92,
        thickness: 1.8,
        ior: 1.7,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        attenuationColor: new THREE.Color(0x9a82ff),
        attenuationDistance: 1.8,
        envMapIntensity: 3.0,
        iridescence: 0.85,
        iridescenceIOR: 1.4,
        iridescenceThicknessRange: [100, 800],
        sheen: 0.6,
        sheenRoughness: 0.4,
        sheenColor: new THREE.Color(0xa78cff),
        side: THREE.FrontSide,
      })
      const heroMesh = new THREE.Mesh(HERO_SHAPES.icosahedron(), heroMat)
      const heroCore = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.32, 0),
        new THREE.MeshBasicMaterial({ color: state.accent, transparent: true, opacity: 0.9 })
      )
      const heroCageMat = new THREE.LineBasicMaterial({
        color: 0xa78cff,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const heroCage: THREE.LineSegments<THREE.WireframeGeometry<THREE.BufferGeometry>> =
        new THREE.LineSegments(
          new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.32, 1) as THREE.BufferGeometry),
          heroCageMat
        )
      const heroRingMat1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
      const heroRing1 = new THREE.Mesh(new THREE.RingGeometry(1.85, 1.92, 128), heroRingMat1)
      heroRing1.rotation.x = Math.PI / 2.2
      const heroRingMat2 = new THREE.MeshBasicMaterial({
        color: state.accent,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
      const heroRing2 = new THREE.Mesh(new THREE.RingGeometry(2.15, 2.18, 128), heroRingMat2)
      heroRing2.rotation.x = Math.PI / 2.8
      heroRing2.rotation.y = Math.PI / 7
      const orbitGeo = new THREE.BufferGeometry()
      const ORBIT_DOTS = 120
      const orbitArr = new Float32Array(ORBIT_DOTS * 3)
      for (let i = 0; i < ORBIT_DOTS; i++) {
        const a = (i / ORBIT_DOTS) * Math.PI * 2
        orbitArr[i * 3] = Math.cos(a) * 2.45
        orbitArr[i * 3 + 1] = 0
        orbitArr[i * 3 + 2] = Math.sin(a) * 2.45
      }
      orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitArr, 3))
      const orbitDotTex = (() => {
        const c = document.createElement('canvas')
        c.width = c.height = 32
        const g = c.getContext('2d')!
        const rg = g.createRadialGradient(16, 16, 0, 16, 16, 16)
        rg.addColorStop(0, 'rgba(255,255,255,1)')
        rg.addColorStop(1, 'rgba(255,255,255,0)')
        g.fillStyle = rg
        g.fillRect(0, 0, 32, 32)
        return new THREE.CanvasTexture(c)
      })()
      const orbitMat = new THREE.PointsMaterial({
        size: 0.045,
        map: orbitDotTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xffffff,
        opacity: 0.9,
      })
      const orbitPoints = new THREE.Points(orbitGeo, orbitMat)
      orbitPoints.rotation.x = Math.PI / 3.5

      const satelliteMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.85,
        thickness: 0.6,
        ior: 1.55,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        envMapIntensity: 2.6,
        attenuationColor: new THREE.Color(0xff9ad0),
        attenuationDistance: 0.8,
        iridescence: 0.9,
        iridescenceIOR: 1.3,
      })
      const satellite = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), satelliteMat)

      const heroGroup = new THREE.Group()
      heroGroup.add(heroMesh, heroCore, heroCage, heroRing1, heroRing2, orbitPoints, satellite)
      stage.add(heroGroup)
      groups.hero = heroGroup

      function rebuildHeroShape(name: string) {
        state.shape = name
        const make = HERO_SHAPES[name] || HERO_SHAPES.icosahedron
        heroMesh.geometry.dispose()
        heroMesh.geometry = make()
        heroCage.geometry.dispose()
        const cageR = name === 'torus' ? 0.95 : 1.32
        const cageBase =
          name === 'torus'
            ? new THREE.TorusKnotGeometry(0.78, 0.26, 60, 12, 2, 3)
            : name === 'dodecahedron'
            ? new THREE.DodecahedronGeometry(1.32, 0)
            : new THREE.IcosahedronGeometry(cageR, 1)
        heroCage.geometry = new THREE.WireframeGeometry(cageBase as THREE.BufferGeometry)
      }

      // ----- ABOUT: wireframe sphere -----
      const aboutGroup = new THREE.Group()
      const aboutSphereGeo = new THREE.IcosahedronGeometry(1.4, 4)
      const aboutWireMat = new THREE.LineBasicMaterial({
        color: 0xf5f5f7,
        transparent: true,
        opacity: 0.55,
      })
      const aboutWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(aboutSphereGeo),
        aboutWireMat
      )
      const aboutInner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.95, 1),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.55 })
      )
      const aboutAccent = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshBasicMaterial({ color: state.accent })
      )
      aboutAccent.position.set(0.9, 0.4, 0.9)
      aboutGroup.add(aboutInner, aboutWire, aboutAccent)
      aboutGroup.position.set(2.6, 0, 0)
      aboutGroup.scale.setScalar(0.0001)
      stage.add(aboutGroup)
      groups.about = aboutGroup

      // ----- WORK: 3D card carousel -----
      const workGroup = new THREE.Group()
      const PROJECTS_DATA = [
        { tag: '001', title: 'Halcyon', sub: 'query engine', accent: '#7c5cff' },
        { tag: '002', title: 'Driftboard', sub: 'realtime canvas', accent: '#4ade80' },
        { tag: '003', title: 'Loom', sub: 'compiler toolkit', accent: '#f97316' },
      ]
      function makeCardTexture(p: { tag: string; title: string; sub: string; accent: string }) {
        const c = document.createElement('canvas')
        c.width = 800
        c.height = 1100
        const g = c.getContext('2d')!
        g.fillStyle = '#0e0e16'
        g.fillRect(0, 0, c.width, c.height)
        const gr = g.createLinearGradient(0, 0, c.width, c.height)
        gr.addColorStop(0, p.accent + '22')
        gr.addColorStop(1, '#00000000')
        g.fillStyle = gr
        g.fillRect(0, 0, c.width, c.height)
        g.strokeStyle = 'rgba(245,245,247,0.10)'
        g.lineWidth = 2
        g.strokeRect(20, 20, c.width - 40, c.height - 40)
        g.fillStyle = '#5a5a68'
        g.font = '500 24px monospace'
        g.fillText(p.tag.toUpperCase(), 60, 80)
        g.fillStyle = '#f5f5f7'
        g.font = '400 96px serif'
        g.fillText(p.title, 60, 230)
        g.fillStyle = '#9a9aa6'
        g.font = 'italic 400 56px serif'
        g.fillText(p.sub, 60, 300)
        g.strokeStyle = 'rgba(245,245,247,0.12)'
        g.beginPath()
        g.moveTo(60, c.height - 120)
        g.lineTo(c.width - 60, c.height - 120)
        g.stroke()
        g.fillStyle = p.accent
        g.beginPath()
        g.arc(c.width - 80, c.height - 80, 14, 0, Math.PI * 2)
        g.fill()
        g.fillStyle = '#5a5a68'
        g.font = '500 22px monospace'
        g.fillText('OPEN ↗', 60, c.height - 70)
        g.strokeStyle = 'rgba(245,245,247,0.05)'
        g.lineWidth = 1
        for (let i = 0; i < 12; i++) {
          g.beginPath()
          g.moveTo(60, 380 + i * 50)
          g.lineTo(c.width - 60, 380 + i * 50)
          g.stroke()
        }
        const tex = new THREE.CanvasTexture(c)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        return tex
      }
      const cards: THREE.Mesh[] = []
      PROJECTS_DATA.forEach((p, i) => {
        const tex = makeCardTexture(p)
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
        })
        const card = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.95), mat)
        const angle = (i / PROJECTS_DATA.length) * Math.PI * 2
        card.userData.angle = angle
        card.userData.baseRadius = 2.2
        workGroup.add(card)
        cards.push(card)
      })
      workGroup.scale.setScalar(0.0001)
      stage.add(workGroup)
      groups.work = workGroup

      // ----- SKILLS: constellation -----
      const skillsGroup = new THREE.Group()
      const NODE_COUNT = 60
      const nodePositions: THREE.Vector3[] = []
      for (let i = 0; i < NODE_COUNT; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / NODE_COUNT)
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
        const r = 1.6
        nodePositions.push(
          new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
          )
        )
      }
      const nodeGeo = new THREE.BufferGeometry()
      const nodeArr = new Float32Array(NODE_COUNT * 3)
      nodePositions.forEach((p, i) => {
        nodeArr[i * 3] = p.x
        nodeArr[i * 3 + 1] = p.y
        nodeArr[i * 3 + 2] = p.z
      })
      nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodeArr, 3))
      function makeDotTexture() {
        const c = document.createElement('canvas')
        c.width = c.height = 64
        const g = c.getContext('2d')!
        const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32)
        rg.addColorStop(0, 'rgba(255,255,255,1)')
        rg.addColorStop(0.35, 'rgba(255,255,255,0.55)')
        rg.addColorStop(1, 'rgba(255,255,255,0)')
        g.fillStyle = rg
        g.fillRect(0, 0, 64, 64)
        return new THREE.CanvasTexture(c)
      }
      const nodeMat = new THREE.PointsMaterial({
        size: 0.08,
        map: makeDotTexture(),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xffffff,
        opacity: 0,
      })
      const nodePoints = new THREE.Points(nodeGeo, nodeMat)
      const linePairs: [number, number][] = []
      for (let i = 0; i < NODE_COUNT; i++) {
        const dists: { j: number; d: number }[] = []
        for (let j = 0; j < NODE_COUNT; j++) {
          if (i === j) continue
          dists.push({ j, d: nodePositions[i].distanceTo(nodePositions[j]) })
        }
        dists.sort((a, b) => a.d - b.d)
        for (let k = 0; k < 3; k++) {
          const j = dists[k].j
          if (j > i) linePairs.push([i, j])
        }
      }
      const lineArr = new Float32Array(linePairs.length * 6)
      linePairs.forEach((pair, k) => {
        const a = nodePositions[pair[0]],
          b = nodePositions[pair[1]]
        lineArr[k * 6 + 0] = a.x
        lineArr[k * 6 + 1] = a.y
        lineArr[k * 6 + 2] = a.z
        lineArr[k * 6 + 3] = b.x
        lineArr[k * 6 + 4] = b.y
        lineArr[k * 6 + 5] = b.z
      })
      const lineGeo = new THREE.BufferGeometry()
      lineGeo.setAttribute('position', new THREE.BufferAttribute(lineArr, 3))
      const lineMat = new THREE.LineBasicMaterial({
        color: state.accent,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const lineSeg = new THREE.LineSegments(lineGeo, lineMat)
      skillsGroup.add(lineSeg, nodePoints)
      skillsGroup.scale.setScalar(0.0001)
      stage.add(skillsGroup)
      groups.skills = skillsGroup

      // ----- CONTACT: particles -> text -----
      const contactGroup = new THREE.Group()
      function sampleTextPoints(text: string, count: number) {
        const c = document.createElement('canvas')
        c.width = 1024
        c.height = 320
        const g = c.getContext('2d')!
        g.fillStyle = '#fff'
        g.font = '600 220px serif'
        g.textBaseline = 'middle'
        g.textAlign = 'center'
        g.fillText(text, c.width / 2, c.height / 2)
        const data = g.getImageData(0, 0, c.width, c.height).data
        const points: [number, number, number][] = []
        let tries = 0
        while (points.length < count && tries < count * 80) {
          const x = (Math.random() * c.width) | 0
          const y = (Math.random() * c.height) | 0
          const idx = (y * c.width + x) * 4 + 3
          if (data[idx] > 128) {
            const wx = (x / c.width - 0.5) * 5.6
            const wy = (0.5 - y / c.height) * 1.7
            const wz = (Math.random() - 0.5) * 0.1
            points.push([wx, wy, wz])
          }
          tries++
        }
        return points
      }
      let particleCount = state.particles
      let particlesGeo: THREE.BufferGeometry | null = null
      let particles: THREE.Points | null = null
      let particlesMat: THREE.PointsMaterial | null = null
      let particleStart: Float32Array = new Float32Array(0)
      let particleTarget: Float32Array = new Float32Array(0)

      function buildParticles(count: number) {
        if (particles && particlesGeo && particlesMat) {
          contactGroup.remove(particles)
          particlesGeo.dispose()
          particlesMat.dispose()
        }
        particleCount = count
        const targetPts = sampleTextPoints("Let's talk.", count)
        particleStart = new Float32Array(count * 3)
        particleTarget = new Float32Array(count * 3)
        const current = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
          const r = 2 + Math.random() * 3
          const a = Math.random() * Math.PI * 2
          const b = Math.acos(2 * Math.random() - 1)
          particleStart[i * 3] = r * Math.sin(b) * Math.cos(a)
          particleStart[i * 3 + 1] = r * Math.sin(b) * Math.sin(a)
          particleStart[i * 3 + 2] = r * Math.cos(b)

          const t = targetPts[i % targetPts.length]
          particleTarget[i * 3] = t[0]
          particleTarget[i * 3 + 1] = t[1]
          particleTarget[i * 3 + 2] = t[2]

          current[i * 3] = particleStart[i * 3]
          current[i * 3 + 1] = particleStart[i * 3 + 1]
          current[i * 3 + 2] = particleStart[i * 3 + 2]
        }
        particlesGeo = new THREE.BufferGeometry()
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(current, 3))
        particlesMat = new THREE.PointsMaterial({
          size: 0.03,
          map: makeDotTexture(),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          color: 0xffffff,
          opacity: 0,
        })
        particles = new THREE.Points(particlesGeo, particlesMat)
        contactGroup.add(particles)
      }
      buildParticles(particleCount)
      contactGroup.scale.setScalar(0.0001)
      stage.add(contactGroup)
      groups.contact = contactGroup

      // ============================================================
      // ANIMATION / SCROLL CHOREOGRAPHY
      // ============================================================
      const sectionIds = ['#hero', '#about', '#services', '#work', '#skills', '#contact']
      const sections = sectionIds.map((s) => document.querySelector(s) as HTMLElement)

      function getSceneProgress() {
        const sy = window.scrollY
        const vh = window.innerHeight
        for (let i = 0; i < sections.length - 1; i++) {
          const a = sections[i]?.offsetTop ?? 0
          const b = sections[i + 1]?.offsetTop ?? 0
          if (sy + vh * 0.4 < b) {
            const local = clamp((sy + vh * 0.4 - a) / (b - a), 0, 1)
            return i + local
          }
        }
        return sections.length - 1
      }

      const sceneState = { prog: 0, mouseX: 0, mouseY: 0, time: 0 }

      function setupReveals() {
        const chars = $$('#hero-title .ch')
        gsap.set(chars, { opacity: 0, y: '0.4em', filter: 'blur(20px)' })
        gsap.to(chars, {
          opacity: 1,
          y: '0em',
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'power3.out',
          stagger: { each: 0.045, from: 'start' },
          delay: 0.3,
        })
        gsap.to('#hero .role', { opacity: 1, duration: 1.2, delay: 1.2, ease: 'power2.out' })
        gsap.to('#hero .hero-ctas', { opacity: 1, y: 0, duration: 1.0, delay: 1.45, ease: 'power2.out' })
        gsap.to('#hero .scroll-cue', { opacity: 1, duration: 1, delay: 1.9 })

        $$('.reveal').forEach((el) => {
          const kids = [...el.children] as HTMLElement[]
          gsap.set(el, { opacity: 0, y: 40 })
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          })
          if (kids.length > 1) {
            gsap.fromTo(
              kids,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                stagger: 0.06,
                scrollTrigger: { trigger: el, start: 'top 80%', once: true },
              }
            )
          }
        })
      }

      // ============================================================
      // PER-FRAME UPDATE
      // ============================================================
      function updateScene(prog: number, t: number, _dt: number) {
        // AMBIENT BACKDROP
        ambientGroup.rotation.y = t * 0.012
        bgRing1.rotation.z = t * 0.04
        bgRing2.rotation.z = -t * 0.05
        bgIco.rotation.x = t * 0.06
        bgIco.rotation.y = t * 0.045
        starMat.opacity = 0.85 + Math.sin(t * 0.6) * 0.12
        nearStarMat.opacity = 0.7 + Math.cos(t * 0.5) * 0.18
        for (const sp of nebulae) {
          const u = sp.userData
          sp.position.x = u.x + Math.sin(t * 0.15 + u.phase) * 0.7
          sp.position.y = u.y + Math.cos(t * 0.18 + u.phase) * 0.5
          sp.material.opacity = 0.75 + Math.sin(t * 0.4 + u.phase) * 0.15
        }
        const dpos = dust.geometry.attributes.position.array as Float32Array
        for (let i = 0; i < DUST_COUNT; i++) {
          dpos[i * 3] += dustVel[i * 3]
          dpos[i * 3 + 1] += dustVel[i * 3 + 1]
          dpos[i * 3 + 2] += dustVel[i * 3 + 2]
          if (dpos[i * 3 + 1] > 5.5) dpos[i * 3 + 1] = -5.5
          if (dpos[i * 3] > 8.5) dpos[i * 3] = -8.5
          if (dpos[i * 3] < -8.5) dpos[i * 3] = 8.5
        }
        dust.geometry.attributes.position.needsUpdate = true
        ambientGroup.rotation.x = sceneState.mouseY * 0.04
        ambientGroup.rotation.y += sceneState.mouseX * 0.0008

        // HERO (0..1)
        const heroVis = 1 - smoothstep(0.0, 1.0, prog)
        heroGroup.visible = heroVis > 0.001
        if (heroGroup.visible) {
          heroMesh.rotation.x += 0.0025 * state.motion
          heroMesh.rotation.y += 0.004 * state.motion
          heroCore.rotation.x -= 0.005 * state.motion
          heroCore.rotation.y -= 0.003 * state.motion
          heroCage.rotation.x -= 0.0018 * state.motion
          heroCage.rotation.y -= 0.0028 * state.motion
          heroRing1.rotation.z = t * 0.35 * state.motion
          heroRing2.rotation.z = -t * 0.28 * state.motion
          heroRing1.rotation.x = Math.PI / 2.2 + Math.sin(t * 0.4) * 0.18
          heroRing2.rotation.y = Math.PI / 7 + Math.cos(t * 0.35) * 0.22
          orbitPoints.rotation.y = t * 0.5 * state.motion
          orbitPoints.rotation.x = Math.PI / 3.5 + Math.sin(t * 0.2) * 0.1
          const sa = t * 1.1 * state.motion
          satellite.position.set(
            Math.cos(sa) * 1.9,
            Math.sin(sa * 1.3) * 0.5,
            Math.sin(sa) * 1.9
          )
          satellite.rotation.x += 0.02 * state.motion
          satellite.rotation.y += 0.03 * state.motion
          const breath = 1 + Math.sin(t * 0.8) * 0.025
          const s = lerp(1.4, 0.6, prog) * breath
          heroGroup.scale.setScalar(s)
          heroGroup.position.x = lerp(0, -1.6, smoothstep(0.4, 1.0, prog))
          heroGroup.position.y = lerp(0, 0.3, smoothstep(0.4, 1.0, prog))
          heroMat.opacity = heroVis
          heroMat.transparent = true
          heroMat.transmission = lerp(0.96, 0.55, smoothstep(0.4, 1.0, prog))
          ;(heroCore.material as THREE.MeshBasicMaterial).opacity = 0.9 * heroVis
          heroCageMat.opacity = 0.4 * heroVis
          heroRingMat1.opacity = 0.45 * heroVis
          heroRingMat2.opacity = 0.5 * heroVis
          orbitMat.opacity = 0.9 * heroVis
          satelliteMat.opacity = heroVis
          satelliteMat.transparent = true
        }

        // ABOUT (sphere) — visible 0.4 .. 1.7
        const aboutP = smoothstep(0.4, 1.0, prog) * (1 - smoothstep(1.4, 2.0, prog))
        aboutGroup.visible = aboutP > 0.001
        if (aboutGroup.visible) {
          aboutWire.rotation.y += 0.0025 * state.motion
          aboutWire.rotation.x += 0.0012 * state.motion
          aboutInner.rotation.y -= 0.002 * state.motion
          aboutAccent.position.set(
            1.0 * Math.cos(t * 0.6),
            0.6 * Math.sin(t * 0.8),
            1.0 * Math.sin(t * 0.6)
          )
          aboutGroup.scale.setScalar(lerp(0.0, 1.0, aboutP))
          aboutGroup.position.x = lerp(3.4, 1.9, aboutP)
          aboutGroup.position.y = lerp(0.6, 0.0, aboutP)
          aboutWireMat.opacity = 0.55 * aboutP
          ;(aboutInner.material as THREE.MeshBasicMaterial).opacity = 0.55 * aboutP
          ;(aboutAccent.material as THREE.MeshBasicMaterial).opacity = aboutP
        }

        // WORK (carousel) — visible 2.5 .. 3.7
        const workP = smoothstep(2.5, 3.0, prog) * (1 - smoothstep(3.4, 4.0, prog))
        workGroup.visible = workP > 0.001
        if (workGroup.visible) {
          workGroup.scale.setScalar(lerp(0.0, 1.0, workP))
          workGroup.rotation.y += 0.003 * state.motion
          workGroup.position.x = lerp(0, 1.4, smoothstep(0.5, 1.0, prog - 2.5))
          cards.forEach((card) => {
            const a = card.userData.angle + sceneState.time * 0.25 * state.motion
            card.position.set(
              Math.sin(a) * card.userData.baseRadius,
              Math.cos(a * 0.7) * 0.3,
              Math.cos(a) * card.userData.baseRadius
            )
            card.lookAt(0, card.position.y * 0.4, 0)
            card.rotateY(Math.PI)
            ;(card.material as THREE.MeshBasicMaterial).opacity = workP
          })
        }

        // SKILLS — the 3D constellation is replaced by the 2D interactive
        // skillviz widget (see initSkillviz). Keep the group disabled so the
        // skills section matches the standalone exactly.
        const skillsP = smoothstep(3.5, 4.0, prog) * (1 - smoothstep(4.4, 5.0, prog))
        skillsGroup.visible = false
        if (false && skillsGroup.visible) {
          skillsGroup.scale.setScalar(lerp(0.0, 1.3, skillsP))
          skillsGroup.rotation.y += 0.0028 * state.motion
          skillsGroup.rotation.x = Math.sin(t * 0.2) * 0.18
          nodeMat.opacity = 0.95 * skillsP
          lineMat.opacity = 0.35 * skillsP
          skillsGroup.position.x = lerp(0, 1.1, smoothstep(0.0, 1.0, prog - 3.5))
        }

        // CONTACT (particles -> text) — visible 4.5 .. 5
        const contactP = smoothstep(4.4, 5.0, prog)
        contactGroup.visible = contactP > 0.001
        if (contactGroup.visible && particles && particlesGeo) {
          contactGroup.scale.setScalar(1)
          contactGroup.position.set(0, 0, 0)
          const posAttr = particles.geometry.attributes.position
          const arr = posAttr.array as Float32Array
          const e = smoothstep(0, 1, contactP)
          for (let i = 0; i < particleCount; i++) {
            const ix = i * 3
            const wobble = Math.sin(t * 0.8 + i * 0.07) * 0.012 * (1 - e)
            arr[ix] = lerp(particleStart[ix], particleTarget[ix], e) + wobble
            arr[ix + 1] = lerp(particleStart[ix + 1], particleTarget[ix + 1], e) + wobble
            arr[ix + 2] = lerp(particleStart[ix + 2], particleTarget[ix + 2], e)
          }
          posAttr.needsUpdate = true
          if (particlesMat) particlesMat.opacity = contactP
        }

        // Parallax tilt
        const tiltX = sceneState.mouseY * 0.1
        const tiltY = sceneState.mouseX * 0.16
        stage.rotation.x += (tiltX - stage.rotation.x) * 0.06
        stage.rotation.y += (tiltY - stage.rotation.y) * 0.06
      }

      let lastT = performance.now()
      function frame(now: number) {
        const dt = Math.min(0.05, (now - lastT) / 1000)
        lastT = now
        sceneState.time += dt
        lenis.raf(now)
        gsap.ticker.tick()
        sceneState.prog = getSceneProgress()
        updateScene(sceneState.prog, sceneState.time, dt)
        renderer.render(scene, camera)
      }

      let lastFrameAt = performance.now()
      function rafLoop(now: number) {
        frame(now)
        lastFrameAt = now
        rafLoopId = requestAnimationFrame(rafLoop)
      }
      rafLoopId = requestAnimationFrame(rafLoop)
      intervalSafetyId = setInterval(() => {
        const now = performance.now()
        if (now - lastFrameAt > 60) {
          frame(now)
          lastFrameAt = now
        }
      }, 33)

      // ============================================================
      // INPUT — mouse parallax + cursor
      // ============================================================
      const cursorEl = document.getElementById('cursor')
      const cursorDot = document.getElementById('cursor-dot')
      const trails = $$('.trail')
      const TRAIL_N = trails.length
      const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      const pos = { x: target.x, y: target.y }
      let lastPx = pos.x,
        lastPy = pos.y

      const mouseMoveHandler = (e: MouseEvent) => {
        target.x = e.clientX
        target.y = e.clientY
        if (cursorDot) {
          cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%,-50%)`
        }
        sceneState.mouseX = (e.clientX / window.innerWidth) * 2 - 1
        sceneState.mouseY = -((e.clientY / window.innerHeight) * 2 - 1)
      }
      window.addEventListener('mousemove', mouseMoveHandler, { passive: true })
      cleanupListeners.push(() => window.removeEventListener('mousemove', mouseMoveHandler))

      let lastCursorAt = performance.now()
      const trailPos = trails.map(() => ({ x: pos.x, y: pos.y }))

      function cursorTick() {
        pos.x += (target.x - pos.x) * 0.18
        pos.y += (target.y - pos.y) * 0.18
        const vx = pos.x - lastPx,
          vy = pos.y - lastPy
        const speed = Math.min(40, Math.sqrt(vx * vx + vy * vy))
        const angle = Math.atan2(vy, vx)
        const stretch = 1 + speed * 0.025
        const squish = 1 / Math.sqrt(stretch)
        const isHover = cursorEl?.classList.contains('hover') ?? false
        const sx = isHover ? 1 : stretch
        const sy = isHover ? 1 : squish
        if (cursorEl) {
          cursorEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%,-50%) rotate(${angle}rad) scale(${sx}, ${sy})`
        }
        lastPx = pos.x
        lastPy = pos.y
        for (let i = 0; i < TRAIL_N; i++) {
          const k = 0.32 - i * 0.025
          const prev = i === 0 ? pos : trailPos[i - 1]
          trailPos[i].x += (prev.x - trailPos[i].x) * k
          trailPos[i].y += (prev.y - trailPos[i].y) * k
          const op = (1 - i / TRAIL_N) * 0.55
          const sc = 1 - i * 0.08
          trails[i].style.opacity = String(op)
          trails[i].style.transform = `translate3d(${trailPos[i].x}px, ${trailPos[i].y}px, 0) translate(-50%,-50%) scale(${sc})`
        }
      }
      function cursorRaf() {
        cursorTick()
        lastCursorAt = performance.now()
        cursorRafId = requestAnimationFrame(cursorRaf)
      }
      cursorRafId = requestAnimationFrame(cursorRaf)
      cursorIntervalId = setInterval(() => {
        if (performance.now() - lastCursorAt > 60) {
          cursorTick()
          lastCursorAt = performance.now()
        }
      }, 33)

      gsap.set('#hero .hero-ctas', { y: 16 })

      const hoverEls = $$('a, button, .swatch, .seg button, .project, .dd-trigger, .dd-menu li')
      const enterHandlers = hoverEls.map((el) => {
        const h = () => cursorEl?.classList.add('hover')
        el.addEventListener('mouseenter', h)
        return { el, h }
      })
      const leaveHandlers = hoverEls.map((el) => {
        const h = () => cursorEl?.classList.remove('hover')
        el.addEventListener('mouseleave', h)
        return { el, h }
      })
      cleanupListeners.push(() => {
        enterHandlers.forEach(({ el, h }) => el.removeEventListener('mouseenter', h))
        leaveHandlers.forEach(({ el, h }) => el.removeEventListener('mouseleave', h))
      })

      const mousedownHandler = () => cursorEl?.classList.add('click')
      const mouseupHandler = () => cursorEl?.classList.remove('click')
      window.addEventListener('mousedown', mousedownHandler)
      window.addEventListener('mouseup', mouseupHandler)
      cleanupListeners.push(() => {
        window.removeEventListener('mousedown', mousedownHandler)
        window.removeEventListener('mouseup', mouseupHandler)
      })

      // ============================================================
      // RESIZE + VISIBILITY
      // ============================================================
      function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight, false)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        ScrollTrigger.refresh()
      }
      window.addEventListener('resize', onResize)
      cleanupListeners.push(() => window.removeEventListener('resize', onResize))

      // ============================================================
      // TWEAKS PANEL
      // ============================================================
      const panel = document.getElementById('tweaks')
      let tweaksMode = false

      function applyAccent(hex: string) {
        state.accent = parseInt(hex.replace('#', ''), 16)
        document.documentElement.style.setProperty('--accent', hex)
        const r = (state.accent >> 16) & 0xff
        const g = (state.accent >> 8) & 0xff
        const b = state.accent & 0xff
        document.documentElement.style.setProperty('--accent-soft', `rgba(${r},${g},${b},0.18)`)
        rim.color.setHex(state.accent)
        ;(heroCore.material as THREE.MeshBasicMaterial).color.setHex(state.accent)
        ;(aboutAccent.material as THREE.MeshBasicMaterial).color.setHex(state.accent)
        lineMat.color.setHex(state.accent)
        heroMat.attenuationColor.setHex(state.accent)
        heroRingMat2.color.setHex(state.accent)
      }

      $$('#tk-accent .swatch').forEach((sw) => {
        sw.addEventListener('click', () => {
          $$('#tk-accent .swatch').forEach((s) => s.classList.remove('on'))
          sw.classList.add('on')
          applyAccent((sw as HTMLElement).dataset.val ?? '#7c5cff')
        })
      })
      $$('#tk-shape button').forEach((btn) => {
        btn.addEventListener('click', () => {
          $$('#tk-shape button').forEach((b) => b.classList.remove('on'))
          btn.classList.add('on')
          rebuildHeroShape((btn as HTMLElement).dataset.val ?? 'icosahedron')
        })
      })
      $$('#tk-motion button').forEach((btn) => {
        btn.addEventListener('click', () => {
          $$('#tk-motion button').forEach((b) => b.classList.remove('on'))
          btn.classList.add('on')
          state.motion = parseFloat((btn as HTMLElement).dataset.val ?? '1')
        })
      })
      const tkGrain = document.getElementById('tk-grain') as HTMLInputElement | null
      if (tkGrain) {
        tkGrain.addEventListener('input', (e) => {
          document.documentElement.style.setProperty('--grain', (e.target as HTMLInputElement).value)
        })
      }
      const tkParticles = document.getElementById('tk-particles') as HTMLInputElement | null
      if (tkParticles) {
        tkParticles.addEventListener('change', (e) => {
          buildParticles(parseInt((e.target as HTMLInputElement).value, 10))
        })
      }
      const tweaksClose = document.getElementById('tweaks-close')
      if (tweaksClose) {
        tweaksClose.addEventListener('click', () => {
          tweaksMode = false
          panel?.classList.remove('on')
        })
      }

      const msgHandler = (e: MessageEvent) => {
        const d = e.data
        if (!d || typeof d !== 'object') return
        if (d.type === 'tweaks-mode' || d.type === 'om-tweak-mode' || d.type === 'tweak-mode') {
          tweaksMode = !!d.enabled
          panel?.classList.toggle('on', tweaksMode)
        }
      }
      window.addEventListener('message', msgHandler)
      cleanupListeners.push(() => window.removeEventListener('message', msgHandler))

      const keydownHandler = (e: KeyboardEvent) => {
        if (e.key === 't' || e.key === 'T') {
          tweaksMode = !tweaksMode
          panel?.classList.toggle('on', tweaksMode)
        }
      }
      window.addEventListener('keydown', keydownHandler)
      cleanupListeners.push(() => window.removeEventListener('keydown', keydownHandler))

      // ============================================================
      // BOOT
      // ============================================================
      setupReveals()

      setTimeout(() => {
        const veil = document.getElementById('veil')
        if (veil) {
          veil.classList.add('gone')
          // Hide instead of removing: #veil is a React-rendered node, and
          // detaching it from the DOM makes React's unmount removeChild throw
          // (NotFoundError) when navigating away from the page.
          setTimeout(() => {
            veil.style.display = 'none'
          }, 900)
        }
        ScrollTrigger.refresh()
      }, 600)
    }

    init().catch(console.error)

    // ============================================================
    // SKILLS — 2D interactive constellation (skillviz)
    // Ported 1:1 from the standalone portfolio. Pure DOM, runs
    // independently of the WebGL scene.
    // ============================================================
    function initSkillviz(): (() => void) | null {
      const root = document.getElementById('skillviz')
      if (!root) return null

      const svg = root.querySelector('.sv-lines') as SVGSVGElement | null
      const nodesLayer = document.getElementById('sv-nodes')
      const core = document.getElementById('sv-core')
      if (!svg || !nodesLayer || !core) return null
      const coreCat = core.querySelector('.sv-core-cat') as HTMLElement | null
      const coreCount = document.getElementById('sv-core-count')
      const readout = document.getElementById('sv-readout') as HTMLElement | null
      const cursor = document.getElementById('cursor')
      const catRows = Array.from(
        document.querySelectorAll('#skills .cats [data-cat]')
      ) as HTMLElement[]
      const SVGNS = 'http://www.w3.org/2000/svg'

      interface SkillNode {
        name: string
        cat: string
        ci: number
        type: 'skill' | 'hub'
        el: HTMLElement
        line?: SVGLineElement
        baseA?: number
        r?: number
        speed?: number
        nx: number
        ny: number
        tx: number
        ty: number
        bx?: number
        by?: number
        ox?: number
        oy?: number
        phase?: number
        hub?: SkillNode
      }

      const CATS = [
        { key: 'Languages', items: ['TypeScript', 'C#', 'Python', 'PHP', 'JavaScript'] },
        { key: 'Backend', items: ['Node.js', 'NestJS', 'Laravel', 'Django', '.NET'] },
        { key: 'Infra', items: ['Docker', 'Jenkins', 'Postgres', 'Redis', 'Firebase'] },
        { key: 'Interface', items: ['React', 'Next.js', 'Astro', 'WebRTC', 'Motion'] },
      ]
      const TOTAL = CATS.reduce((n, c) => n + c.items.length, 0)
      const catCount = (k: string) =>
        (CATS.find((c) => c.key === k) || { items: [] }).items.length
      if (coreCount) coreCount.textContent = TOTAL + ' tools'

      let nodes: SkillNode[] = []
      let style = 'orbit'
      let active: (SkillNode & { isCat?: boolean }) | { cat: string; isCat: boolean } | null =
        null
      let size = 1
      let t = 0
      let last = performance.now()
      const mouse = { x: 0.5, y: 0.5, inside: false }

      function mkChip(name: string, cls?: string) {
        const el = document.createElement('div')
        el.className = 'sv-chip' + (cls ? ' ' + cls : '')
        el.textContent = name
        nodesLayer!.appendChild(el)
        return el
      }
      function mkLine() {
        const ln = document.createElementNS(SVGNS, 'line') as SVGLineElement
        svg!.appendChild(ln)
        return ln
      }
      function attach(node: SkillNode) {
        node.el.addEventListener('mouseenter', () => {
          setActive(node)
          cursor && cursor.classList.add('hover')
        })
        node.el.addEventListener('mouseleave', () => {
          clearActive()
          cursor && cursor.classList.remove('hover')
        })
      }

      // ----- ORBIT -----
      const ringDefs = [
        { r: 0.22, speed: 0.09, phase: 0.2 },
        { r: 0.31, speed: -0.068, phase: 1.1 },
        { r: 0.39, speed: 0.052, phase: 0.6 },
        { r: 0.47, speed: -0.04, phase: 1.7 },
      ]
      function buildOrbit() {
        core!.style.display = ''
        CATS.forEach((cat, ci) => {
          const rd = ringDefs[ci]
          const n = cat.items.length
          cat.items.forEach((name, i) => {
            const baseA = (i / n) * Math.PI * 2 + rd.phase
            const node: SkillNode = {
              name,
              cat: cat.key,
              ci,
              type: 'skill',
              el: mkChip(name),
              line: mkLine(),
              baseA,
              r: rd.r,
              speed: rd.speed,
              nx: 0.5 + Math.cos(baseA) * rd.r,
              ny: 0.5 + Math.sin(baseA) * rd.r,
              tx: 0.5,
              ty: 0.5,
            }
            attach(node)
            nodes.push(node)
          })
        })
      }
      function tickOrbit() {
        for (const nd of nodes) {
          const a = nd.baseA! + t * nd.speed!
          nd.tx = 0.5 + Math.cos(a) * nd.r!
          nd.ty = 0.5 + Math.sin(a) * nd.r!
        }
      }

      // ----- CLUSTERS -----
      const clusterCenters = [
        [0.3, 0.32],
        [0.7, 0.3],
        [0.3, 0.7],
        [0.7, 0.7],
      ]
      function buildClusters() {
        core!.style.display = 'none'
        CATS.forEach((cat, ci) => {
          const c = clusterCenters[ci]
          const hub: SkillNode = {
            name: cat.key,
            cat: cat.key,
            ci,
            type: 'hub',
            el: mkChip(cat.key, 'sv-hub'),
            bx: c[0],
            by: c[1],
            nx: c[0],
            ny: c[1],
            tx: c[0],
            ty: c[1],
            phase: ci * 1.7,
          }
          attach(hub)
          nodes.push(hub)
          const n = cat.items.length
          const rr = 0.135
          cat.items.forEach((name, i) => {
            const ang = (i / n) * Math.PI * 2 - Math.PI / 2
            const node: SkillNode = {
              name,
              cat: cat.key,
              ci,
              type: 'skill',
              hub,
              el: mkChip(name),
              line: mkLine(),
              ox: Math.cos(ang) * rr,
              oy: Math.sin(ang) * rr,
              phase: ci * 1.7 + i * 0.5,
              nx: c[0],
              ny: c[1],
              tx: c[0],
              ty: c[1],
            }
            attach(node)
            nodes.push(node)
          })
        })
      }
      function tickClusters() {
        for (const h of nodes) {
          if (h.type !== 'hub') continue
          h.tx = h.bx! + Math.sin(t * 0.4 + h.phase!) * 0.012
          h.ty = h.by! + Math.cos(t * 0.5 + h.phase!) * 0.012
        }
        for (const nd of nodes) {
          if (nd.type !== 'skill') continue
          nd.tx = nd.hub!.tx + nd.ox! + Math.sin(t * 0.6 + nd.phase!) * 0.006
          nd.ty = nd.hub!.ty + nd.oy! + Math.cos(t * 0.7 + nd.phase!) * 0.006
        }
      }

      // ----- interaction -----
      function setActive(node: SkillNode) {
        active = node
        root!.classList.add('is-active')
        for (const n of nodes) {
          n.el.classList.toggle('is-active', n === node)
          n.el.classList.toggle('is-kin', n !== node && n.cat === node.cat)
        }
        if (readout) {
          if (node.type === 'hub')
            readout.innerHTML = '<b>' + node.cat + '</b> · ' + catCount(node.cat) + ' tools'
          else readout.innerHTML = '<b>' + node.name + '</b> · ' + node.cat
        }
        catRows.forEach((r) => r.classList.toggle('cat-hot', r.dataset.cat === node.cat))
        if (style === 'orbit' && coreCat) coreCat.textContent = node.cat
        drawLines()
      }
      function highlightCat(cat: string) {
        active = { cat, isCat: true }
        root!.classList.add('is-active')
        for (const n of nodes) {
          n.el.classList.toggle('is-kin', n.cat === cat)
          n.el.classList.remove('is-active')
        }
        catRows.forEach((r) => r.classList.toggle('cat-hot', r.dataset.cat === cat))
        if (readout) readout.innerHTML = '<b>' + cat + '</b> · ' + catCount(cat) + ' tools'
        if (style === 'orbit' && coreCat) coreCat.textContent = cat
        drawLines()
      }
      function clearActive() {
        active = null
        root!.classList.remove('is-active')
        for (const n of nodes) n.el.classList.remove('is-active', 'is-kin')
        catRows.forEach((r) => r.classList.remove('cat-hot'))
        if (coreCat) coreCat.textContent = 'toolkit'
        hideLines()
      }
      function drawLines() {
        if (style === 'orbit') {
          for (const n of nodes) {
            if (!n.line) continue
            let o = 0
            if (active) {
              if (n === active) o = 0.9
              else if (n.cat === active.cat) o = active.isCat ? 0.6 : 0.28
            }
            n.line.style.opacity = String(o)
          }
        } else {
          for (const n of nodes) {
            if (!n.line) continue
            let o = 0.14
            if (active) o = n.cat === active.cat ? (n === active ? 0.85 : 0.6) : 0.05
            n.line.style.opacity = String(o)
          }
        }
      }
      function hideLines() {
        const base = style === 'orbit' ? 0 : 0.14
        for (const n of nodes) if (n.line) n.line.style.opacity = String(base)
      }

      // ----- render loop -----
      function renderViz(dt: number) {
        t += dt
        if (style === 'orbit') tickOrbit()
        else tickClusters()

        const thr = 0.17
        for (const nd of nodes) {
          let tx = nd.tx
          let ty = nd.ty
          let s = 1
          if (mouse.inside) {
            const dx = mouse.x - tx
            const dy = mouse.y - ty
            const d = Math.hypot(dx, dy)
            if (d < thr) {
              const k = 1 - d / thr
              tx += dx * 0.16 * k
              ty += dy * 0.16 * k
              s = 1 + 0.15 * k
            }
          }
          nd.nx += (tx - nd.nx) * 0.18
          nd.ny += (ty - nd.ny) * 0.18
          const px = nd.nx * size
          const py = nd.ny * size
          nd.el.style.transform = `translate3d(${px}px,${py}px,0) translate(-50%,-50%) scale(${s.toFixed(
            3
          )})`
          nd.el.style.zIndex = s > 1.015 ? '6' : ''
        }
        for (const nd of nodes) {
          if (!nd.line) continue
          let x1: number
          let y1: number
          if (style === 'orbit') {
            x1 = 500
            y1 = 500
          } else {
            x1 = nd.hub!.nx * 1000
            y1 = nd.hub!.ny * 1000
          }
          nd.line.setAttribute('x1', String(x1))
          nd.line.setAttribute('y1', String(y1))
          nd.line.setAttribute('x2', String(nd.nx * 1000))
          nd.line.setAttribute('y2', String(nd.ny * 1000))
        }
      }

      // ----- build / switch -----
      function clearViz() {
        nodesLayer!.innerHTML = ''
        svg!.innerHTML = ''
        nodes = []
        active = null
        root!.classList.remove('is-active')
        catRows.forEach((r) => r.classList.remove('cat-hot'))
        if (coreCat) coreCat.textContent = 'toolkit'
      }
      function setStyle(s: string) {
        style = s
        root!.dataset.style = s
        clearViz()
        if (s === 'orbit') buildOrbit()
        else buildClusters()
        hideLines()
      }

      // ----- wiring -----
      function measure() {
        size = root!.getBoundingClientRect().width || 1
      }
      let ro: ResizeObserver | null = null
      if (window.ResizeObserver) {
        ro = new ResizeObserver(measure)
        ro.observe(root)
      }
      measure()

      const pointerMove = (e: PointerEvent) => {
        const r = root!.getBoundingClientRect()
        mouse.x = (e.clientX - r.left) / r.width
        mouse.y = (e.clientY - r.top) / r.height
        mouse.inside = true
      }
      const pointerLeave = () => {
        mouse.inside = false
      }
      root.addEventListener('pointermove', pointerMove)
      root.addEventListener('pointerleave', pointerLeave)

      const rowEnter: Array<{ el: HTMLElement; h: () => void }> = []
      const rowLeave: Array<{ el: HTMLElement; h: () => void }> = []
      catRows.forEach((row) => {
        const he = () => {
          highlightCat(row.dataset.cat as string)
          cursor && cursor.classList.add('hover')
        }
        const hl = () => {
          clearActive()
          cursor && cursor.classList.remove('hover')
        }
        row.addEventListener('mouseenter', he)
        row.addEventListener('mouseleave', hl)
        rowEnter.push({ el: row, h: he })
        rowLeave.push({ el: row, h: hl })
      })

      const seg = document.getElementById('tk-skillviz')
      if (seg) {
        seg.querySelectorAll('button').forEach((b) => {
          b.addEventListener('click', () => {
            seg.querySelectorAll('button').forEach((x) => x.classList.remove('on'))
            b.classList.add('on')
            setStyle((b as HTMLElement).dataset.val as string)
          })
        })
      }

      function step() {
        const now = performance.now()
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        renderViz(dt)
      }
      let lastRaf = performance.now()
      let vizRafId = 0
      function loop() {
        step()
        lastRaf = performance.now()
        vizRafId = requestAnimationFrame(loop)
      }

      setStyle('orbit')
      vizRafId = requestAnimationFrame(loop)
      const vizSafetyId = setInterval(() => {
        if (performance.now() - lastRaf > 80) step()
      }, 40)

      return () => {
        cancelAnimationFrame(vizRafId)
        clearInterval(vizSafetyId)
        if (ro) ro.disconnect()
        root.removeEventListener('pointermove', pointerMove)
        root.removeEventListener('pointerleave', pointerLeave)
        rowEnter.forEach(({ el, h }) => el.removeEventListener('mouseenter', h))
        rowLeave.forEach(({ el, h }) => el.removeEventListener('mouseleave', h))
      }
    }
    const skillvizCleanup = initSkillviz()
    if (skillvizCleanup) cleanupListeners.push(skillvizCleanup)

    return () => {
      initialized.current = false
      cancelAnimationFrame(rafLoopId)
      cancelAnimationFrame(cursorRafId)
      clearInterval(intervalSafetyId)
      clearInterval(cursorIntervalId)
      cleanupListeners.forEach((fn) => fn())
      if (cleanupRenderer) cleanupRenderer.dispose()
      if (cleanupLenis) cleanupLenis.destroy()
      if (cleanupScrollTrigger) cleanupScrollTrigger.killAll()
      cleanupGeometries.forEach((g) => g.dispose())
      cleanupMaterials.forEach((m) => m.dispose())
    }
  }, [])

  return null
}
