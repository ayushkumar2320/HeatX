import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function EarthGlobe() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    // 1. Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100)
    camera.position.set(0, 0, 4.5)
    camera.lookAt(0, 0, 0)

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    // 3. Texture Loader
    const textureLoader = new THREE.TextureLoader()
    const dayTexture = textureLoader.load('/textures/earth_day.jpg')
    dayTexture.colorSpace = THREE.SRGBColorSpace
    dayTexture.anisotropy = 8

    const normalTexture = textureLoader.load('/textures/earth_normal.jpg')
    normalTexture.anisotropy = 8

    const specularTexture = textureLoader.load('/textures/earth_specular.jpg')
    specularTexture.anisotropy = 8

    const cloudsTexture = textureLoader.load('/textures/earth_clouds.png')
    cloudsTexture.anisotropy = 8

    // Group to hold globe, clouds, and atmosphere
    const earthGroup = new THREE.Group()
    const radius = 3.6
    // Positioned vertically at the 35% mark, adjusted slightly down
    earthGroup.position.set(0, -3.98, 0)
    earthGroup.rotation.set(0, 0, 0)
    scene.add(earthGroup)

    // 4. Earth Sphere - Rotated to place Mumbai (19.08°N, 72.88°E) towards the top crest
    const rxMumbai = 0.7610  // 43.6 deg tilt brings Mumbai up to the top crest
    const ryMumbai = -2.6040 // -149.2 deg rotation centers Mumbai horizontally at x=0

    const earthGeometry = new THREE.SphereGeometry(radius, 64, 64)
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: dayTexture,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughnessMap: specularTexture,
      roughness: 0.62,
      metalness: 0.12,
    })
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial)
    earthMesh.rotation.x = rxMumbai
    earthMesh.rotation.y = ryMumbai
    earthGroup.add(earthMesh)

    // 5. Clouds Sphere
    const cloudGeometry = new THREE.SphereGeometry(radius * 1.008, 64, 64)
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.26,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const cloudsMesh = new THREE.Mesh(cloudGeometry, cloudMaterial)
    cloudsMesh.rotation.x = rxMumbai
    cloudsMesh.rotation.y = ryMumbai
    earthGroup.add(cloudsMesh)

    // 6. Thin, Crisp Atmospheric Rim Glow (Fresnel shader)
    const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.009, 64, 64)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = 1.0 - max(0.0, dot(vNormal, viewDir));
          float intensity = pow(fresnel, 5.5);
          vec3 atmosphereColor = mix(vec3(0.0, 0.5, 1.0), vec3(0.2, 0.9, 1.0), fresnel);
          gl_FragColor = vec4(atmosphereColor, intensity * 0.85);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
    })
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    earthGroup.add(atmosphereMesh)

    // Thin outer atmospheric haze membrane
    const outerAtmosphereGeometry = new THREE.SphereGeometry(radius * 1.018, 64, 64)
    const outerAtmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(max(0.0, 0.58 - dot(vNormal, vec3(0.0, 0.0, 1.0))), 4.5);
          gl_FragColor = vec4(0.08, 0.60, 1.0, 1.0) * intensity * 0.5;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    })
    const outerAtmosphereMesh = new THREE.Mesh(outerAtmosphereGeometry, outerAtmosphereMaterial)
    earthGroup.add(outerAtmosphereMesh)

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight(0x0e2444, 1.2)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xfff5e0, 2.8)
    sunLight.position.set(4.5, 2.0, 3.2)
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.1)
    fillLight.position.set(-4.0, 1.5, 2.0)
    scene.add(fillLight)

    // 8. Animation & Interaction
    let animationFrameId: number
    const startTime = performance.now()
    let lastTime = startTime
    let cloudsRy = ryMumbai

    // Controlled parallax centered on Mumbai
    let targetRotationX = 0
    let targetRotationY = 0
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) - 0.5
      const normY = (e.clientY / window.innerHeight) - 0.5
      targetRotationY = normX * 0.12
      targetRotationX = normY * 0.03
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      const now = performance.now()
      const delta = (now - lastTime) / 1000
      lastTime = now
      const elapsed = (now - startTime) / 1000

      // Subtle living planetary drift keeping Mumbai focused at the top
      earthMesh.rotation.y = ryMumbai + Math.sin(elapsed * 0.12) * 0.05
      earthMesh.rotation.x = rxMumbai + Math.cos(elapsed * 0.08) * 0.02

      // Clouds drift across continuously
      cloudsRy += delta * 0.015
      cloudsMesh.rotation.y = cloudsRy

      // Gentle interactive mouse parallax damping
      earthGroup.rotation.y += (targetRotationY - earthGroup.rotation.y) * 0.04
      earthGroup.rotation.x += (targetRotationX - earthGroup.rotation.x) * 0.04

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // 9. Resize handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      earthGeometry.dispose()
      cloudGeometry.dispose()
      atmosphereGeometry.dispose()
      outerAtmosphereGeometry.dispose()
      earthMaterial.dispose()
      cloudMaterial.dispose()
      atmosphereMaterial.dispose()
      outerAtmosphereMaterial.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        top: '10px', // Exact 10px downward shift
        width: '100%',
        height: '100%',
        zIndex: 3,
        pointerEvents: 'none',
        overflow: 'hidden',
        transform: 'translateY(10px)', // Guarantees 10px downward offset across all browsers
      }}
    >
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Sunrise bloom glow on the right horizon */}
      <div
        style={{
          position: 'absolute',
          right: '5%',
          bottom: '8%',
          width: '460px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 215, 130, 0.40) 0%, rgba(255, 175, 75, 0.20) 28%, rgba(56, 189, 248, 0.10) 54%, transparent 74%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />

      {/* Very thin subtle horizon atmospheric glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '16vh',
          background: 'radial-gradient(ellipse 90% 40% at 50% 90%, rgba(0, 180, 255, 0.06) 0%, rgba(0, 100, 220, 0.02) 50%, transparent 75%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
